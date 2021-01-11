import { IsDate, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPartySentimentDto {
	@IsString()
	@Type(() => String)
	party?: string;

	@IsInt()
	@Type(() => Number)
	minSampleSize?: number;

	@IsDate()
	@Type(() => Date)
	start?: Date;

	@IsDate()
	@Type(() => Date)
	end?: Date;

	@IsInt()
	@Type(() => Number)
	resample?: number;
}
