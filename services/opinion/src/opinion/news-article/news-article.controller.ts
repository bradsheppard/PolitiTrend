import { Controller, Delete, Get, Query } from '@nestjs/common';
import { NewsArticleService } from './news-article.service';
import { SearchNewsArticleDto } from './dto/search-news-article.dto';

@Controller('newsarticle')
export class NewsArticleController {
	constructor(private newsArticleService: NewsArticleService) {}

	@Get()
	async findAll(@Query() query: SearchNewsArticleDto) {
		return await this.newsArticleService.get(query);
	}

	@Delete()
	async delete() {
		return await this.newsArticleService.delete();
	}
}
