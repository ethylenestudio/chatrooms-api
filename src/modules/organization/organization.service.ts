import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPerPage } from 'config';
import {
  CreateOrganizationDto,
  FindOrganizationDto,
  UpdateOrganizationDto,
} from 'src/dtos/Organization.dto';
import { Organization } from 'src/entities/Organization.entity';
import { BadRequest } from 'src/errors/errors';
import { isNumeric } from 'src/helpers/isNumeric';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
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

  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    const { name, managerId } = data;
    const isExist = await this.organizationRepository.findOneBy({
      name,
    });
    if (isExist) {
      BadRequest('Organization already exists. Try updating it.');
    }
    const newOrganization = this.organizationRepository.create({
      name,
      manager_id: managerId,
    });

    return await this.organizationRepository.save(newOrganization);
  }

  async updateOrganization(data: UpdateOrganizationDto): Promise<Organization> {
    const { newName, id } = data;

    const isExist = await this.organizationRepository.findOneBy({
      id,
    });

    if (!isExist) {
      BadRequest('Organization does not exists.');
    }

    await this.organizationRepository.update({ id }, { name: newName });
    const newEntity = await this.organizationRepository.findOneBy({
      id,
    });
    return newEntity;
  }
}
