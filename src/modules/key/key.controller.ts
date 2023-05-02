import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KeyService } from './key.service';
import { CreateKeyDto } from 'src/dtos/Key.dto';

@Controller('key')
export class KeyController {
    constructor(private keyService: KeyService) {}

    @Post('generate')
    async generate(@Body() keyDetails: CreateKeyDto) {
        return await this.keyService.createKey(keyDetails);
    }

    @Get('valid/:key')
    async valid(@Param('key') key: string) {
        return await this.keyService.isValid(key);
    }
}
