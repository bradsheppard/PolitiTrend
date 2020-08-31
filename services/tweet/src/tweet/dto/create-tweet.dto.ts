import { IsDate, IsDateString, IsInt, IsISO8601, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTweetDto {
	@IsInt({each: true})
	@Type(() => Number)
	politicians: number[];

	@IsString()
	tweetId: string;

	@IsString()
	tweetText: string;

	@IsDate()
	@Type(() => Date)
	dateTime: Date;

	@IsString()
	location: string;
}
