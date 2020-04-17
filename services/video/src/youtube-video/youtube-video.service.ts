import { Injectable } from '@nestjs/common';
import { SearchYoutubeVideoDto } from './dtos/search-youtube-video.dto';
import { YoutubeVideo } from './interfaces/youtube-video.interface';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { CreateYoutubeVideoDto } from './dtos/create-youtube-video.dto';

@Injectable()
export class YoutubeVideoService {
    constructor(@InjectModel('YoutubeVideo') private readonly youtubeVideoModel: Model<YoutubeVideo>) {}

    async find(searchYoutubeVideoDto: SearchYoutubeVideoDto): Promise<YoutubeVideo[]> {
        let query = this.youtubeVideoModel.find();

        if (searchYoutubeVideoDto.politician) {
            query = query.find({politicians: searchYoutubeVideoDto.politician})
        }

        if (searchYoutubeVideoDto.limit) {
            query = query.limit(searchYoutubeVideoDto.limit);
        }

        if (searchYoutubeVideoDto.offset) {
            query = query.skip(searchYoutubeVideoDto.offset);
        }

        query = query.sort({_id: 'desc'});

        return await query.exec();
    }

    async create(createYoutubeVideoDto: CreateYoutubeVideoDto): Promise<YoutubeVideo> {
        const createYoutubeVideo = new this.youtubeVideoModel(createYoutubeVideoDto);
        return await createYoutubeVideo.save();
    }

    async delete() {
        await this.youtubeVideoModel.deleteMany({}).exec();
    }
}