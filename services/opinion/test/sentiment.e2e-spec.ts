import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { SentimentService } from '../src/sentiment/sentiment.service';
import { CreateTweetDto } from '../src/opinion/tweet/dto/create-tweet.dto';
import { TweetService } from '../src/opinion/tweet/tweet.service';

let app: INestApplication;
let sentimentService: SentimentService;
let tweetService: TweetService;

let id = 0;

function createTweetForPolitician(politicianId: number, sentiment: number) {
	id++;
	return {
		tweetText: `test text ${id}`,
		tweetId: id.toString(),
		sentiments: [
			{
				politician: politicianId,
				value: sentiment,
			},
		],
		dateTime: new Date().toUTCString(),
	} as CreateTweetDto;
}

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();

	sentimentService = moduleFixture.get<SentimentService>(SentimentService);
	tweetService = moduleFixture.get<TweetService>(TweetService);
	await app.init();
});

afterAll(async () => {
	await app.close();
});

describe('SentimentService (e2e)', () => {
	it('Can get value average', async () => {
		const testTweet1 = createTweetForPolitician(160, 6.5);
		const testTweet2 = createTweetForPolitician(160, 9);

		await tweetService.insert(testTweet1);
		await tweetService.insert(testTweet2);

		const averageSentiment = await sentimentService.getSentimentAverageForPolitician(160);
		expect(averageSentiment).toEqual(7.75);
	});

	it('Can get value average, nonexistent politician', async () => {
		const testTweet1 = createTweetForPolitician(62, 6.5);
		const testTweet2 = createTweetForPolitician(62, 9);

		await tweetService.insert(testTweet1);
		await tweetService.insert(testTweet2);

		const averageSentiment = await sentimentService.getSentimentAverageForPolitician(999);
		expect(averageSentiment).toBeNull();
	});

	it('Can get value average when no politicians', async () => {
		await tweetService.delete();

		const averageSentiment = await sentimentService.getSentimentAverageForPolitician(1);
		expect(averageSentiment).toBeNull();
	});
});
