import { IsNumber, IsString } from 'class-validator';

export class CreateYoutubeVideoDto {
    @IsString()
    videoId: string;

    @IsString()
    title: string;

    @IsString()
    thumbnail: string;

    @IsNumber({}, {each: true})
    politicians: number[];
}
