import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { KeyService } from './key.service';
import { CreateKeyDto } from 'src/dtos/Key.dto';
import { BadRequest } from 'src/errors/errors';

@Controller('key')
export class KeyController {
    constructor(private keyService: KeyService) {}

    @Post('generate')
    async generate(@Headers() headers, @Body() keyDetails: CreateKeyDto) {
        const { authorization } = headers;
        if (!authorization) {
            BadRequest('No signature provided!');
        }
        const signature = authorization;
        return await this.keyService.createKey(signature, keyDetails);
    }

    @Get('valid/:key')
    async valid(@Param('key') key: string) {
        return await this.keyService.isValid(key);
    }
}
