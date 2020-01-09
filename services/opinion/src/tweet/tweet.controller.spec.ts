import { Test, TestingModule } from '@nestjs/testing';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Tweet from './tweet.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('Tweet Controller', () => {
	let controller: TweetController;
	let service: TweetService;

	let id = 0;

	function createOpinion() {
		id++;
		return {
			id,
			tweetText: `test text ${id}`,
			sentiment: id + 0.25,
			tweetId: id.toString(),
			politician: id,
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
		const opinion = createOpinion();
		jest.spyOn(service, 'get').mockResolvedValueOnce([opinion]);
		expect(await controller.findAll({})).toEqual([opinion]);
	});

	it('can get with politician', async () => {
		const opinion = createOpinion();
		const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce([opinion]);
		await controller.findAll({politician: 1});
		expect(getSpy).toBeCalledWith({politician: 1});
	});

	it('can get one when exists', async () => {
		const opinion = createOpinion();
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(opinion);
		expect(await controller.findOne(opinion.id.toString())).toEqual(opinion);
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
		const opinion = createOpinion();
		const insertSpy = jest.spyOn(service, 'upsertOnTweetId').mockImplementation();
		await controller.handleOpinionCreated(opinion);
		expect(insertSpy).toBeCalled();
	});
});
