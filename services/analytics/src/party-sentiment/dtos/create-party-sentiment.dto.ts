import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePartySentimentDto {
	@IsString()
	@Type(() => String)
	party: string;

	@IsNumber()
	@Type(() => Number)
	sentiment: number;

	@IsInt()
	@Type(() => Number)
	sampleSize: number;

	@IsDate()
	@Type(() => Date)
	dateTime?: Date;
}
