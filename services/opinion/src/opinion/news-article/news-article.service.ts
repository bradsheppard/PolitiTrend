import { SearchNewsArticleDto } from './dto/search-news-article.dto';
import NewsActicle from './news-article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentiment } from '../../sentiment/sentiment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsArticleService {

	constructor(
		@InjectRepository(NewsActicle)
		private readonly newsArticleRepository: Repository<NewsActicle>,
		@InjectRepository(Sentiment)
		private readonly sentimentRepository: Repository<Sentiment>,
	) {}

	async get(searchDto: SearchNewsArticleDto): Promise<NewsActicle[]> {

	}

	async delete(): Promise<void> {
		await this.newsArticleRepository.delete({});
	}
}
