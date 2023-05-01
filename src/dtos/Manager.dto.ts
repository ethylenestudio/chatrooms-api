import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManagerDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  organizationId: number;
}

export class FindManagerDto {
  page?: number;

  search?: string;

  organizationId?: number;
}
