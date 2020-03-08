import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { NewsArticleService } from './news-article.service';
import { SearchNewsArticleDto } from './dto/search-news-article.dto';
import { EventPattern } from '@nestjs/microservices';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';

@Controller()
export class NewsArticleController {
	constructor(private newsArticleService: NewsArticleService) {}

	@Get()
	async findAll(@Query() query: SearchNewsArticleDto) {
		return await this.newsArticleService.get(query);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const newsArticle = await this.newsArticleService.getOne(parseInt(id, 10));

		if (!newsArticle) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return newsArticle;
	}

	@Post()
	async create(@Body() createNewsArticleDto: CreateNewsArticleDto) {
		return await this.newsArticleService.upsertOnUrl(createNewsArticleDto);
	}

	@Delete()
	async delete() {
		return await this.newsArticleService.delete();
	}

	@Delete(':id')
	async deleteOne(@Param('id') id: string) {
		const successful = await this.newsArticleService.deleteOne(parseInt(id, 10));

		if (!successful) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
	}

	@EventPattern('news-article-created')
	async handleNewsArticleCreated(createNewsArticleDto: CreateNewsArticleDto) {
		await this.newsArticleService.upsertOnUrl(createNewsArticleDto);
	}
}
