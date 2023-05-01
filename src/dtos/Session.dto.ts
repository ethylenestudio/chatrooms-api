import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  creatorId?: number;

  @IsNumber()
  @IsNotEmpty()
  organizationId: number;
}

export class UpdateSessionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  newName: string;
}

export class FindSessionDto {
  page?: number;

  search?: string;
}
