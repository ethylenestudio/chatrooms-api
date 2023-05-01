import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  managerId?: number;
}

export class UpdateOrganizationDto {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  @IsString()
  @IsNotEmpty()
  newName: string;
}

export class FindOrganizationDto {
  page?: number;

  search?: string;
}
