import { CreateSentimentDto } from '../../../sentiment/dto/create-sentiment.dto';

export class UpdateTweetDto {
	id: number;
	sentiments: CreateSentimentDto[];
	tweetId: string;
	tweetText: string;
	dateTime: string;
}
