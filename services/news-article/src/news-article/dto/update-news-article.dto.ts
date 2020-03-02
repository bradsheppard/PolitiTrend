import { CreateSentimentDto } from '../../sentiment/dto/create-sentiment.dto';

export class UpdateNewsArticleDto {
	id: number;
	sentiments: CreateSentimentDto[];
	dateTime: string;
	image: string;
	title: string;
	url: string;
	source: string;
	description: string;
}
