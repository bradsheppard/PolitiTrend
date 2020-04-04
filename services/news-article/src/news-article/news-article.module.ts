import { Module } from '@nestjs/common';
import { NewsArticleController } from './news-article.controller';
import { NewsArticleService } from './news-article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import NewsArticle from './news-article.entity';

@Module({
	controllers: [NewsArticleController],
	providers: [NewsArticleService],
	imports: [TypeOrmModule.forFeature([NewsArticle])],
})
export class NewsArticleModule {}
