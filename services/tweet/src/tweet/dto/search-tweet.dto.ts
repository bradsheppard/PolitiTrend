import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchTweetDto {
	@IsString()
	tweetId?: string;

	@IsInt()
	@Type(() => Number)
	politician?: number;

	@IsInt()
	@Type(() => Number)
	limit?: number;

	@IsInt()
	@Type(() => Number)
	offset?: number;
}
