import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { SessionService } from './session.service';
import {
    CreateSessionDto,
    FindSessionByOrganizationDto,
    FindSessionDto,
    UpdateSessionDto,
} from 'src/dtos/Session.dto';
import { Session } from 'src/entities/Session.entity';
import { BadRequest } from 'src/errors/errors';

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

    @Get('findBySignature')
    async bySignature(
        @Headers() headers,
        @Query() params: FindSessionDto,
    ): Promise<Session[]> {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        return await this.sessionService.findBySignature(signature, params);
    }

    @Post('create')
    async create(
        @Headers() headers,
        @Body() sessionDetails: CreateSessionDto,
    ): Promise<Session> {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        const newSession = await this.sessionService.createSession(
            signature,
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
