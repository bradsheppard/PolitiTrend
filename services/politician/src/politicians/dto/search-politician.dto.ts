import { IsArray, IsBoolean, IsEnum, IsInt } from 'class-validator';
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

	@IsInt()
	@Type(() => Number)
	limit?: number;

	@IsInt()
	@Type(() => Number)
	offset?: number;
}
