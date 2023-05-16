import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPerPage, verificationMessage } from 'config';
import { ethers } from 'ethers';
import {
    CreateOrganizationDto,
    FindOrganizationDto,
    UpdateOrganizationDto,
} from 'src/dtos/Organization.dto';
import { Manager } from 'src/entities/Manager.entity';
import { Organization } from 'src/entities/Organization.entity';
import { BadRequest, UnAuthorized } from 'src/errors/errors';
import { isNumeric } from 'src/helpers/isNumeric';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
    ) {}

    async findById(id: string): Promise<Organization> {
        if (!isNumeric(id)) {
            BadRequest('Id should be a valid numeric value.');
        }
        return await this.organizationRepository.findOneBy({ id: Number(id) });
    }

    async findByName(name: string): Promise<Organization> {
        return await this.organizationRepository.findOneBy({ name });
    }

    async find(params: FindOrganizationDto): Promise<Organization[]> {
        let query = this.organizationRepository
            .createQueryBuilder('organization')
            .orderBy('organization.id', 'DESC')
            .take(ItemPerPage.Organization)
            .skip(ItemPerPage.Organization * params.page || 0)
            .getMany();

        if (params.search != null) {
            query = this.organizationRepository
                .createQueryBuilder('organization')
                .where(
                    `LOWER(organization.name) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .orderBy('organization.id', 'DESC')
                .take(ItemPerPage.Organization)
                .skip(ItemPerPage.Organization * params.page || 0)
                .getMany();
        }

        return await query;
    }

    async createOrganization(
        signature: string,
        data: CreateOrganizationDto,
    ): Promise<Organization> {
        const { name, managerId } = data;
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
        const isExist = await this.organizationRepository.findOneBy({
            name: name.toLowerCase(),
        });
        if (isExist) {
            BadRequest('Organization already exists. Try updating it.');
        }
        if (manager.organization_id != 0) {
            UnAuthorized('Unauthorized');
        }
        const newOrganization = this.organizationRepository.create({
            name: name.toLowerCase(),
            manager_id: managerId,
        });

        return await this.organizationRepository.save(newOrganization);
    }

    async updateOrganization(
        signature: string,
        data: UpdateOrganizationDto,
    ): Promise<Organization> {
        const { id, newManager } = data;
        const verification = ethers.utils.verifyMessage(
            verificationMessage,
            signature,
        );
        const manager = await this.managerRepository.findOne({
            where: { address: verification.toLowerCase() },
        });
        const isExist = await this.organizationRepository.findOneBy({
            id,
        });

        if (!isExist) {
            BadRequest('Organization does not exists.');
        }
        if (manager.organization_id != 0) {
            UnAuthorized('Unauthorized');
        }

        // await this.organizationRepository.update(
        //     { id },
        //     { manager_id: newManager },
        // );
        await this.managerRepository.update(
            { id: isExist.manager_id },
            { managed_organization: null },
        );
        await this.managerRepository.update(
            { id: newManager },
            { managed_organization: id },
        );
        const newEntity = await this.organizationRepository.save({
            id,
            manager_id: newManager,
        });

        return newEntity;
    }

    async findBySignature(signature: string, params: FindOrganizationDto) {
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
        let query = this.organizationRepository
            .createQueryBuilder('organization')
            .where('organization.id = :id', {
                id: manager.organization_id,
            })
            .orderBy('organization.id', 'DESC')
            .take(ItemPerPage.Organization)
            .skip(ItemPerPage.Organization * params.page || 0)
            .getMany();

        if (params.search != null) {
            query = this.organizationRepository
                .createQueryBuilder('organization')
                .where(
                    `LOWER(organization.name) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .andWhere('organization.id = :id', {
                    id: manager.organization_id,
                })
                .orderBy('organization.id', 'DESC')
                .take(ItemPerPage.Organization)
                .skip(ItemPerPage.Organization * params.page || 0)
                .getMany();
        }
        if (manager.organization_id == 0) {
            query = this.organizationRepository
                .createQueryBuilder('organization')
                .where(
                    `LOWER(organization.name) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .orderBy('organization.id', 'DESC')
                .take(ItemPerPage.Organization)
                .skip(ItemPerPage.Organization * params.page || 0)
                .getMany();
        }
        if (params.noPaginated && manager.organization_id == 0) {
            query = this.organizationRepository
                .createQueryBuilder('organization')
                .where(
                    `LOWER(organization.name) LIKE '%${params.search.toLowerCase()}%'`,
                )
                .orderBy('organization.id', 'DESC')
                .getMany();
        }

        return await query;
    }
}
