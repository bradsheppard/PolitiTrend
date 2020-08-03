import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchSentimentDto {
	@IsInt()
	@Type(() => Number)
	politician?: number;

	@IsInt()
	@Type(() => Number)
	minSampleSize?: number;
}
