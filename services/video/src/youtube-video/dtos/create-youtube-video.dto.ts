import { IsNumber, IsString } from 'class-validator';

export class CreateYoutubeVideoDto {
    @IsString()
    videoId: string;

    @IsString()
    title: string;

    @IsNumber({}, {each: true})
    politicians: number[];
}
