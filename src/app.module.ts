import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from 'config';
import { OrganizationModule } from './modules/organization/organization.module';
import { KeyModule } from './modules/key/key.module';
import { SessionModule } from './modules/session/session.module';
import { ManagerModule } from './modules/manager/manager.module';
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(DatabaseConfig),
        OrganizationModule,
        KeyModule,
        SessionModule,
        ManagerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
