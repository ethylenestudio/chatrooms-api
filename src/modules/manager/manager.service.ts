import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPerPage } from 'config';
import {
    CreateManagerDto,
    FindByOrganizationDto,
    FindManagerDto,
} from 'src/dtos/Manager.dto';
import { Manager } from 'src/entities/Manager.entity';
import { BadRequest } from 'src/errors/errors';
import { isNumeric } from 'src/helpers/isNumeric';
import { Repository } from 'typeorm';

@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
    ) {}

    async findById(id: string): Promise<Manager> {
        if (!isNumeric(id)) {
            BadRequest('Id should be a valid numeric value.');
        }

        return await this.managerRepository.findOneBy({ id: Number(id) });
    }

    async findByAddress(address: string): Promise<Manager> {
        return await this.managerRepository.findOneBy({
            address: address.toLowerCase(),
        });
    }

    async findByOrganization(
        params: FindByOrganizationDto,
    ): Promise<Manager[]> {
        if (!isNumeric(params.organizationId.toString())) {
            BadRequest('Id should be a valid numeric value.');
        }
        let query = this.managerRepository
            .createQueryBuilder('manager')
            .where(`manager.organization_id = :id`, {
                id: params.organizationId,
            })
            .orderBy('manager.id', 'DESC')
            .take(ItemPerPage.Manager)
            .skip(ItemPerPage.Manager * params.page || 0)
            .getMany();

        if (params.search != null) {
            query = this.managerRepository
                .createQueryBuilder('manager')
                .where(
                    `LOWER(manager.address) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .andWhere(`manager.organization_id = :id`, {
                    id: params.organizationId,
                })
                .orderBy('manager.id', 'DESC')
                .take(ItemPerPage.Manager)
                .skip(ItemPerPage.Manager * params.page || 0)
                .getMany();
        }

        return await query;
    }

    async find(params: FindManagerDto): Promise<Manager[]> {
        let query = this.managerRepository
            .createQueryBuilder('manager')
            .orderBy('manager.id', 'DESC')
            .take(ItemPerPage.Manager)
            .skip(ItemPerPage.Manager * params.page || 0)
            .getMany();

        if (params.organizationId != null) {
            query = this.managerRepository
                .createQueryBuilder('manager')
                .where(`manager.organization_id = :id`, {
                    id: params.organizationId,
                })
                .orderBy('manager.id', 'DESC')
                .take(ItemPerPage.Manager)
                .skip(ItemPerPage.Manager * params.page || 0)
                .getMany();
        }

        if (params.search != null) {
            query = this.managerRepository
                .createQueryBuilder('manager')
                .where(
                    `LOWER(manager.address) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .orderBy('manager.id', 'DESC')
                .take(ItemPerPage.Manager)
                .skip(ItemPerPage.Manager * params.page || 0)
                .getMany();
        }

        if (params.search != null && params.organizationId != null) {
            query = this.managerRepository
                .createQueryBuilder('manager')
                .where(
                    `LOWER(manager.address) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .andWhere(`manager.organization_id = :id`, {
                    id: params.organizationId,
                })
                .orderBy('manager.id', 'DESC')
                .take(ItemPerPage.Manager)
                .skip(ItemPerPage.Manager * params.page || 0)
                .getMany();
        }

        return await query;
    }

    async createManager(data: CreateManagerDto): Promise<Manager> {
        const { address, organizationId } = data;

        const isExist = await this.managerRepository.findOneBy({
            address,
        });

        if (isExist) {
            BadRequest('Manager address already exists.');
        }

        const newManager = this.managerRepository.create({
            address,
            organization_id: organizationId,
        });

        return await this.managerRepository.save(newManager);
    }
}
