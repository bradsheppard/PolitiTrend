import { CreateSentimentDto } from '../../opinion/dto/create-sentiment.dto';

export class CreateTweetDto {
	sentiments: CreateSentimentDto[];
	tweetId: string;
	tweetText: string;
}
