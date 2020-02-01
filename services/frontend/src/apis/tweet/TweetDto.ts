import SentimentDto from './SentimentDto';

interface TweetDto {
	id: number;
	tweetId: string;
	tweetText: string;
	sentiments: SentimentDto[];
}

export default TweetDto;
