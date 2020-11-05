import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPoliticianWordCloudDto {
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
