import { IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchStatePartyAffiliationDto {
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
