import { IsArray, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../politicians.entity';

export class SearchPoliticianDto {
	@IsBoolean()
	@Type(() => Boolean)
	active?: boolean;

	@IsArray()
	@IsEnum(Role, { each: true })
	@Type(() => String)
	role?: string[];
}
