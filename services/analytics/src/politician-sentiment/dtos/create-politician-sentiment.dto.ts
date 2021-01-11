import { IsDate, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePoliticianSentimentDto {
    @IsInt()
    @Type(() => Number)
    politician: number;

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
