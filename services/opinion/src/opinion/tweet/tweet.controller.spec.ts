import { Test, TestingModule } from '@nestjs/testing';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Tweet from './tweet.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Sentiment } from '../../sentiment/sentiment.entity';

describe('Tweet Controller', () => {
	let controller: TweetController;
	let service: TweetService;

	let id = 0;

	function createTweet() {
		id++;
		return {
			id,
			tweetText: `test text ${id}`,
			tweetId: id.toString(),
			sentiments: [
				{
					politician: id,
					value: id,
				},
			],
		} as Tweet;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TweetController],
			providers: [TweetService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(Tweet),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Sentiment),
					useClass: Repository,
				},
			],
		}).compile();

		controller = module.get<TweetController>(TweetController);
		service = module.get<TweetService>(TweetService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('can get all', async () => {
		const tweet = createTweet();
		jest.spyOn(service, 'get').mockResolvedValueOnce([tweet]);
		expect(await controller.findAll({})).toEqual([tweet]);
	});

	it('can get with politician', async () => {
		const tweet = createTweet();
		const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce([tweet]);
		await controller.findAll({politician: 1});
		expect(getSpy).toBeCalledWith({politician: 1});
	});

	it('can get one when exists', async () => {
		const tweet = createTweet();
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(tweet);
		expect(await controller.findOne(tweet.id.toString())).toEqual(tweet);
	});

	it('cant get returns 404 when not exists', async () => {
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(null);
		await expect(controller.findOne('1')).rejects.toThrowError(new HttpException('Not found', 404));
	});

	it('delete when exists', async () => {
		jest.spyOn(service, 'deleteOne').mockResolvedValueOnce(true);
		await expect(controller.delete('1')).resolves.not.toThrow();
	});

	it('delete returns 404 when not exists', async () => {
		jest.spyOn(service, 'deleteOne').mockResolvedValueOnce(false);
		await expect(controller.delete('1')).rejects.toThrowError(new HttpException('Not found', 404));
	});

	it('can insert on event', async () => {
		const tweet = createTweet();
		const insertSpy = jest.spyOn(service, 'upsertOnTweetId').mockImplementation();
		await controller.handleTweetCreated(tweet);
		expect(insertSpy).toBeCalled();
	});
});
