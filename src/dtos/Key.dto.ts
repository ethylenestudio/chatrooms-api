import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateKeyDto {
    @IsNumber()
    @IsNotEmpty()
    sessionId: number;
}
