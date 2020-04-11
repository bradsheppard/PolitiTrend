import { Injectable } from '@nestjs/common';
import { SearchYoutubeDto } from './dtos/search-youtube.dto';

@Injectable()
export class YoutubeService {
    async get(searchYoutubeDto: SearchYoutubeDto) {}
}
