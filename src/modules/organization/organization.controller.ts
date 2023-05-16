import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
    CreateOrganizationDto,
    FindOrganizationDto,
    UpdateOrganizationDto,
} from 'src/dtos/Organization.dto';
import { Organization } from 'src/entities/Organization.entity';
import { BadRequest } from 'src/errors/errors';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Get('findById/:id')
    async byId(@Param('id') id: string): Promise<Organization> {
        return await this.organizationService.findById(id);
    }

    @Get('findBySignature')
    async bySignature(
        @Headers() headers,
        @Query() params: FindOrganizationDto,
    ): Promise<Organization[]> {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        return await this.organizationService.findBySignature(
            signature,
            params,
        );
    }

    @Post('create')
    async create(
        @Headers() headers,
        @Body() organizationDetails: CreateOrganizationDto,
    ): Promise<Organization> {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        const newOrganization =
            await this.organizationService.createOrganization(
                signature,
                organizationDetails,
            );
        return newOrganization;
    }

    @Post('update')
    async update(
        @Headers() headers,
        @Body() organizationDetails: UpdateOrganizationDto,
    ): Promise<Organization> {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        const updatedOrganization =
            await this.organizationService.updateOrganization(
                signature,
                organizationDetails,
            );

        return updatedOrganization;
    }
}
