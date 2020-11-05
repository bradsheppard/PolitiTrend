import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentSchema } from './schemas/sentiment.schema';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Sentiment', schema: SentimentSchema }])],
    controllers: [SentimentController],
    providers: [SentimentService],
})
export class SentimentModule {}
