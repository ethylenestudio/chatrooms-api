import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SessionService } from './session.service';
import {
    CreateSessionDto,
    FindSessionByOrganizationDto,
    FindSessionDto,
    UpdateSessionDto,
} from 'src/dtos/Session.dto';
import { Session } from 'src/entities/Session.entity';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Get('find')
    async find(@Query() params: FindSessionDto): Promise<Session[]> {
        return await this.sessionService.find(params);
    }

    @Get('findById/:id')
    async byId(@Param('id') id: string): Promise<Session> {
        return await this.sessionService.findById(id);
    }

    @Get('findByName/:name')
    async byName(@Param('name') name: string): Promise<Session> {
        return await this.sessionService.findByName(name);
    }

    @Get('findByOrganization')
    async byOrganization(
        @Query() params: FindSessionByOrganizationDto,
    ): Promise<Session[]> {
        return await this.sessionService.findByOrganization(params);
    }

    @Post('create')
    async create(@Body() sessionDetails: CreateSessionDto): Promise<Session> {
        const newSession = await this.sessionService.createSession(
            sessionDetails,
        );
        return newSession;
    }

    @Post('update')
    async update(@Body() sessionDetails: UpdateSessionDto): Promise<Session> {
        const updatedSession = await this.sessionService.updateSession(
            sessionDetails,
        );

        return updatedSession;
    }
}
