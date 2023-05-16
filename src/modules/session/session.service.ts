import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPerPage, verificationMessage } from 'config';
import { ethers } from 'ethers';
import {
    CreateSessionDto,
    FindSessionByOrganizationDto,
    FindSessionDto,
    UpdateSessionDto,
} from 'src/dtos/Session.dto';
import { Manager } from 'src/entities/Manager.entity';
import { Session } from 'src/entities/Session.entity';
import { BadRequest, UnAuthorized } from 'src/errors/errors';
import { isNumeric } from 'src/helpers/isNumeric';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
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

    async createSession(
        signature: string,
        data: CreateSessionDto,
    ): Promise<Session> {
        const { name, creatorId, organizationId } = data;
        try {
            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                signature,
            );
            const manager = await this.managerRepository.findOne({
                where: { address: verification.toLowerCase() },
            });
            if (!manager) {
                BadRequest('No manager found!');
            }
            const isExist = await this.sessionRepository.findOneBy({
                name: name.toLowerCase(),
            });
            if (isExist) {
                BadRequest('Session already exists. Try updating it.');
            }
            if (
                manager.organization_id != organizationId &&
                manager.organization_id != 0
            ) {
                UnAuthorized('Unauthorized!');
            }
            const newSession = this.sessionRepository.create({
                name: name.toLowerCase(),
                created_by: creatorId,
                organization_id: organizationId,
            });

            return await this.sessionRepository.save(newSession);
        } catch (e) {
            BadRequest(e.message);
        }
    }

    async updateSession(data: UpdateSessionDto): Promise<Session> {
        const { newName, id } = data;

        const isExist = await this.sessionRepository.findOneBy({
            id,
        });

        if (!isExist) {
            BadRequest('Organization does not exists.');
        }

        await this.sessionRepository.update(
            { id },
            { name: newName.toLowerCase() },
        );
        const newEntity = await this.sessionRepository.findOneBy({
            id,
        });
        return newEntity;
    }
    async findBySignature(
        signature: string,
        params: FindSessionDto,
    ): Promise<Session[]> {
        try {
            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                signature,
            );
            const manager = await this.managerRepository.findOne({
                where: { address: verification.toLowerCase() },
            });
            if (!manager) {
                BadRequest('No manager found!');
            }
            let query = this.sessionRepository
                .createQueryBuilder('session')
                .where('session.organization_id = :id', {
                    id: manager.organization_id,
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
                    .andWhere('session.organization_id = :id', {
                        id: manager.organization_id,
                    })
                    .orderBy('session.id', 'DESC')
                    .take(ItemPerPage.Session)
                    .skip(ItemPerPage.Session * params.page || 0)
                    .getMany();
            }
            if (manager.organization_id == 0) {
                query = this.sessionRepository
                    .createQueryBuilder('session')
                    .leftJoinAndSelect('session.organization', 'organization')
                    .where(
                        `LOWER(organization.name) LIKE '%${params.search.toLowerCase()}%'`,
                    )
                    .orWhere(
                        `LOWER(session.name) LIKE '%${params.search.toLowerCase()}%'`,
                    )
                    .orderBy('session.id', 'DESC')
                    .take(ItemPerPage.Session)
                    .skip(ItemPerPage.Session * params.page || 0)
                    .getMany();
            }
            return await query;
        } catch (e) {
            BadRequest(e.message);
        }
    }
}
