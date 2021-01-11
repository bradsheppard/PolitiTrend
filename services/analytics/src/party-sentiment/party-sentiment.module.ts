import { Module } from '@nestjs/common';
import { PartySentimentController } from './party-sentiment.controller';
import { PartySentimentService } from './party-sentiment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PartySentimentSchema } from './schemas/party-sentiment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'PartySentiment', schema: PartySentimentSchema }])],
  controllers: [PartySentimentController],
  providers: [PartySentimentService]
})
export class PartySentimentModule {}
