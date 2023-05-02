import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
    CreateOrganizationDto,
    FindOrganizationDto,
    UpdateOrganizationDto,
} from 'src/dtos/Organization.dto';
import { Organization } from 'src/entities/Organization.entity';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Get('find')
    async find(@Query() params: FindOrganizationDto): Promise<Organization[]> {
        return await this.organizationService.find(params);
    }

    @Get('findById/:id')
    async byId(@Param('id') id: string): Promise<Organization> {
        return await this.organizationService.findById(id);
    }

    @Get('findByName/:name')
    async byName(@Param('name') name: string): Promise<Organization> {
        return await this.organizationService.findByName(name);
    }

    @Post('create')
    async create(
        @Body() organizationDetails: CreateOrganizationDto,
    ): Promise<Organization> {
        const newOrganization =
            await this.organizationService.createOrganization(
                organizationDetails,
            );
        return newOrganization;
    }

    @Post('update')
    async update(
        @Body() organizationDetails: UpdateOrganizationDto,
    ): Promise<Organization> {
        const updatedOrganization =
            await this.organizationService.updateOrganization(
                organizationDetails,
            );

        return updatedOrganization;
    }
}
