import { Module } from '@nestjs/common';
import { YoutubeVideoController } from './youtube-video.controller';
import { YoutubeVideoService } from './youtube-video.service';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeVideoSchema } from './schemas/youtube-video.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'YoutubeVideo', schema: YoutubeVideoSchema }])],
    controllers: [YoutubeVideoController],
    providers: [YoutubeVideoService],
})
export class YoutubeVideoModule {
}
