import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateKeyDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  sessionId: number;
}
