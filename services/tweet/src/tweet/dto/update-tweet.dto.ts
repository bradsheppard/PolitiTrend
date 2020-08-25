import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTweetDto {
	@IsInt()
	@Type(() => Number)
	id: number;

	@IsInt({each: true})
	@Type(() => Number)
	politicians: number[];

	@IsString()
	tweetId: string;

	@IsString()
	tweetText: string;

	@IsString()
	location: string;

	@IsString()
	dateTime: string;
}
