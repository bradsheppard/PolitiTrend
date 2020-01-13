import { Module } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentiment } from './sentiment.entity';

@Module({
	providers: [SentimentService],
	exports: [SentimentService],
	imports: [TypeOrmModule.forFeature([Sentiment])],
})
export class SentimentModule {}
