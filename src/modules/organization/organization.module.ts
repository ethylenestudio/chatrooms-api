import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/Organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Manager } from 'src/entities/Manager.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Organization, Manager])],
    providers: [OrganizationService],
    controllers: [OrganizationController],
})
export class OrganizationModule {}
