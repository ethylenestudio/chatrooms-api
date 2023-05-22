import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from 'src/entities/Key.entity';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { Manager } from 'src/entities/Manager.entity';
import { Session } from 'src/entities/Session.entity';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        TypeOrmModule.forFeature([Key, Manager, Session]),
        BullModule.registerQueue({
            name: 'keyCleaner',
        }),
    ],
    providers: [KeyService],
    controllers: [KeyController],
})
export class KeyModule {}
