import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { YoutubeVideoService } from './youtube-video.service';
import { SearchYoutubeVideoDto } from './dtos/search-youtube-video.dto';
import { YoutubeVideo } from './interfaces/youtube-video.interface';
import { CreateYoutubeVideoDto } from './dtos/create-youtube-video.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('youtube')
export class YoutubeVideoController {
    constructor(private youtubeVideoService: YoutubeVideoService) {}

    @Get()
    async findAll(@Query() searchYoutubeDto: SearchYoutubeVideoDto): Promise<YoutubeVideo[]> {
        return await this.youtubeVideoService.find(searchYoutubeDto);
    }

    @Post()
    async create(@Body() createYoutubeVideoDto: CreateYoutubeVideoDto): Promise<YoutubeVideo> {
        return await this.youtubeVideoService.create(createYoutubeVideoDto)
    }

    @EventPattern('video-youtube-video-created')
    async handleYoutubeVideoCreated(createYoutubeVideoDto: CreateYoutubeVideoDto) {
        await this.youtubeVideoService.create(createYoutubeVideoDto);
    }
}
