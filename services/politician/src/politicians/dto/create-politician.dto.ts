import { IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../politicians.entity';

export class CreatePoliticianDto {
	@IsString()
	name: string;

	@IsString()
	party: string;

	@IsString()
	@Transform(role => role as Role)
	role: Role;

	@IsBoolean()
	active?: boolean;
}
