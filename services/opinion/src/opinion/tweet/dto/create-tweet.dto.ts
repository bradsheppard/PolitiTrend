import { CreateSentimentDto } from '../../../sentiment/dto/create-sentiment.dto';

export class CreateTweetDto {
	sentiments: CreateSentimentDto[];
	tweetId: string;
	tweetText: string;
	dateTime: string;
}
