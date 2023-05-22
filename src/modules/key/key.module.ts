import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from 'src/entities/Key.entity';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { Manager } from 'src/entities/Manager.entity';
import { Session } from 'src/entities/Session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Key, Manager, Session])],
    providers: [KeyService],
    controllers: [KeyController],
})
export class KeyModule {}
