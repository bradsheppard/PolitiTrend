import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoliticianSentimentSchema } from './schemas/politician-sentiment.schema';
import { PoliticianSentimentController } from './politician-sentiment.controller';
import { PoliticianSentimentService } from './politician-sentiment.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'PoliticianSentiment', schema: PoliticianSentimentSchema }])],
    controllers: [PoliticianSentimentController],
    providers: [PoliticianSentimentService],
})
export class PoliticianSentimentModule {}
