import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsArticleModule } from './news-article/news-article.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		NewsArticleModule
	],
})
export class AppModule {
}
