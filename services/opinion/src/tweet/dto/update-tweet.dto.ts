import { CreateSentimentDto } from '../../opinion/dto/create-sentiment.dto';

export class UpdateTweetDto {
	id: number;
	sentiments: CreateSentimentDto[];
	tweetId: string;
	tweetText: string;
}
