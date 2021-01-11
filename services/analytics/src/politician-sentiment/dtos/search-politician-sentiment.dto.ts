import { IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPoliticianSentimentDto {
    @IsInt()
    @Type(() => Number)
    politician?: number;

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
