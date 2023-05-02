import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPerPage } from 'config';
import {
    CreateSessionDto,
    FindSessionByOrganizationDto,
    FindSessionDto,
    UpdateSessionDto,
} from 'src/dtos/Session.dto';
import { Session } from 'src/entities/Session.entity';
import { BadRequest } from 'src/errors/errors';
import { isNumeric } from 'src/helpers/isNumeric';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {}

    async findById(id: string): Promise<Session> {
        if (!isNumeric(id)) {
            BadRequest('Id should be a valid numeric value.');
        }
        return await this.sessionRepository.findOneBy({ id: Number(id) });
    }

    async findByName(name: string): Promise<Session> {
        return await this.sessionRepository.findOneBy({ name });
    }

    async findByOrganization(
        params: FindSessionByOrganizationDto,
    ): Promise<Session[]> {
        if (!isNumeric(String(params.organizationId))) {
            BadRequest('Id should be a valid numeric value.');
        }
        let query = this.sessionRepository
            .createQueryBuilder('session')
            .where(`session.organization_id = :id`, {
                id: params.organizationId,
            })
            .orderBy('session.id', 'DESC')
            .take(ItemPerPage.Session)
            .skip(ItemPerPage.Session * params.page || 0)
            .getMany();

        if (params.search != null) {
            query = this.sessionRepository
                .createQueryBuilder('session')
                .where(
                    `LOWER(session.name) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .andWhere(`session.organization_id = :id`, {
                    id: params.organizationId,
                })
                .orderBy('session.id', 'DESC')
                .take(ItemPerPage.Session)
                .skip(ItemPerPage.Session * params.page || 0)
                .getMany();
        }
        return await query;
    }

    async find(params: FindSessionDto): Promise<Session[]> {
        let query = this.sessionRepository
            .createQueryBuilder('session')
            .orderBy('session.id', 'DESC')
            .take(ItemPerPage.Session)
            .skip(ItemPerPage.Session * params.page || 0)
            .getMany();

        if (params.search != null) {
            query = this.sessionRepository
                .createQueryBuilder('session')
                .where(
                    `LOWER(session.name) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .orderBy('session.id', 'DESC')
                .take(ItemPerPage.Session)
                .skip(ItemPerPage.Session * params.page || 0)
                .getMany();
        }

        return await query;
    }

    async createSession(data: CreateSessionDto): Promise<Session> {
        const { name, creatorId, organizationId } = data;
        const isExist = await this.sessionRepository.findOneBy({
            name,
        });
        if (isExist) {
            BadRequest('Session already exists. Try updating it.');
        }
        const newOrganization = this.sessionRepository.create({
            name,
            created_by: creatorId,
            organization_id: organizationId,
        });

        return await this.sessionRepository.save(newOrganization);
    }

    async updateSession(data: UpdateSessionDto): Promise<Session> {
        const { newName, id } = data;

        const isExist = await this.sessionRepository.findOneBy({
            id,
        });

        if (!isExist) {
            BadRequest('Organization does not exists.');
        }

        await this.sessionRepository.update({ id }, { name: newName });
        const newEntity = await this.sessionRepository.findOneBy({
            id,
        });
        return newEntity;
    }
}
