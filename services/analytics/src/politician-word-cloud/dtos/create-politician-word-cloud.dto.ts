import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePoliticianWordCloudDto {
    @IsInt()
    @Type(() => Number)
    politician: number;

    words: CreateWord[];
}

export class CreateWord {
    @IsString()
    word: string;

    @IsInt()
    @Type(() => Number)
    count: number;
}
