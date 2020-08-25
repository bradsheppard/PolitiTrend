import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTweetDto {
	@IsInt({each: true})
	@Type(() => Number)
	politicians: number[];

	@IsString()
	tweetId: string;

	@IsString()
	tweetText: string;

	@IsString()
	dateTime: string;

	@IsString()
	location: string;
}
