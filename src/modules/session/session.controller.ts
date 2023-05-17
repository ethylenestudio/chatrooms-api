import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto, FindSessionDto } from 'src/dtos/Session.dto';
import { Session } from 'src/entities/Session.entity';
import { BadRequest } from 'src/errors/errors';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

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
}
