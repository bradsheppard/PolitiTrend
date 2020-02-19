import { CreateSentimentDto } from '../../../sentiment/dto/create-sentiment.dto';

export class CreateNewsArticleDto {
	sentiments: CreateSentimentDto[];
	dateTime: string;
	image: string;
	title: string;
	url: string;
}
