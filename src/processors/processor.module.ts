import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from 'src/entities/Key.entity';
import { KeyCleanerService } from './KeyCleanerService';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'keyCleaner',
        }),
        TypeOrmModule.forFeature([Key]),
    ],
    providers: [KeyCleanerService],
})
export class ProcessorModule {}
