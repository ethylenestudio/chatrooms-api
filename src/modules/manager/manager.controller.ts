import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto, FindManagerDto } from 'src/dtos/Manager.dto';
import { Manager } from 'src/entities/Manager.entity';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('find')
  async find(@Query() params: FindManagerDto): Promise<Manager[]> {
    return await this.managerService.find(params);
  }

  @Get('findByOrganization/:id')
  async byOrganization(@Param('id') id: string): Promise<Manager[]> {
    return await this.managerService.findByOrganization(id);
  }

  @Get('findById/:id')
  async byId(@Param('id') id: string): Promise<Manager> {
    return await this.managerService.findById(id);
  }

  @Get('findByName/:address')
  async byName(@Param('address') address: string): Promise<Manager> {
    return await this.managerService.findByAddress(address);
  }

  @Post('create')
  async create(@Body() managerDetails: CreateManagerDto): Promise<Manager> {
    const newManager = await this.managerService.createManager(managerDetails);
    return newManager;
  }
}
