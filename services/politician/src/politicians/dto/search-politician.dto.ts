import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPoliticianDto {
	@IsBoolean()
	@Type(() => Boolean)
	active?: boolean;
}
