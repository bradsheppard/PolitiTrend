import { Module } from '@nestjs/common';
import { NewsArticleController } from './news-article.controller';
import { NewsArticleService } from './news-article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import NewsActicle from './news-article.entity';
import { Sentiment } from '../../sentiment/sentiment.entity';

@Module({
	controllers: [NewsArticleController],
	providers: [NewsArticleService],
	imports: [TypeOrmModule.forFeature([NewsActicle, Sentiment])],
})
export class NewsArticleModule {}
