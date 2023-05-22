import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullConfig, DatabaseConfig } from 'config';
import { OrganizationModule } from './modules/organization/organization.module';
import { KeyModule } from './modules/key/key.module';
import { SessionModule } from './modules/session/session.module';
import { ManagerModule } from './modules/manager/manager.module';
import { BullModule } from '@nestjs/bull';
import { ProcessorModule } from './processors/processor.module';
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(DatabaseConfig),
        BullModule.forRoot(BullConfig),
        OrganizationModule,
        KeyModule,
        SessionModule,
        ManagerModule,
        ProcessorModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
