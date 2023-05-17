import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    managerId?: number;
}

export class UpdateOrganizationDto {
    @IsNotEmpty()
    id: number;

    newName?: string;

    newManager?: number;
}

export class FindOrganizationDto {
    page?: number;

    search?: string;

    noPaginated?: string;
}
