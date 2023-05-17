import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from 'src/dtos/Manager.dto';
import { Manager } from 'src/entities/Manager.entity';
import { BadRequest } from 'src/errors/errors';

@Controller('manager')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) {}

    @Get('findById/:id')
    async byId(@Param('id') id: string): Promise<Manager> {
        return await this.managerService.findById(id);
    }

    @Get('findBySignature')
    async bySignature(
        @Headers() headers,
        @Query('organizationId') organizationId: string,
    ) {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        return await this.managerService.findBySignature(
            signature.toLowerCase(),
            organizationId,
        );
    }

    @Get('isAdminOrManager')
    async adminOrManager(@Headers() headers) {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        return await this.managerService.adminOrManager(
            signature.toLowerCase(),
        );
    }

    @Post('create')
    async create(
        @Headers() headers,
        @Body() managerDetails: CreateManagerDto,
    ): Promise<Manager> {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        const { address } = managerDetails;
        const newManager = await this.managerService.createManager(signature, {
            ...managerDetails,
            address: address.toLowerCase(),
        });
        return newManager;
    }

    @Post('delete')
    async delete(@Headers() headers, @Body('managerId') managerId: number) {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        return await this.managerService.deleteManager(
            signature.toLowerCase(),
            managerId,
        );
    }
}
