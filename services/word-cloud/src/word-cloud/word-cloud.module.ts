import { Module } from '@nestjs/common';
import { WordCloudController } from './word-cloud.controller';
import { WordCloudService } from './word-cloud.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WordCloudSchema } from './schemas/word-cloud.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'WordCloud', schema: WordCloudSchema }])],
  controllers: [WordCloudController],
  providers: [WordCloudService]
})
export class WordCloudModule {}
