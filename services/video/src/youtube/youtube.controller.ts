import { Controller, Get, Query } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { SearchYoutubeDto } from './dtos/search-youtube.dto';

@Controller('youtube')
export class YoutubeController {
    constructor(private youtubeService: YoutubeService) {}

    @Get()
    async findAll(@Query() searchYoutubeDto: SearchYoutubeDto) {
        return await this.youtubeService.get(searchYoutubeDto);
    }
}
