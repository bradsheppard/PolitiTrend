import { IsDate, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStatePartyAffiliationDto {
    @IsString()
    state: string;

    @IsInt()
    @Type(() => Number)
    sampleSize: number;

    @IsDate()
    @Type(() => Date)
    dateTime?: Date;

    affiliations: Affiliations;
}

export class Affiliations {
    @IsInt()
    @Type(() => Number)
    democratic: number;

    @IsInt()
    @Type(() => Number)
    republican: number;
}
