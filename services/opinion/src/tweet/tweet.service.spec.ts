import { Test, TestingModule } from '@nestjs/testing';
import { TweetService } from './tweet.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Tweet from './tweet.entity';
import { Repository } from 'typeorm';

describe('Tweet Service', () => {
	let service: TweetService;
	let repository: Repository<Tweet>;

	let id = 0;

	function createOpinion() {
		id++;
		return {
			tweetText: `test text ${id}`,
			tweetId: id.toString(),
			sentiments: [
				{
					politician: id,
					sentiment: id
				}
			],
		} as Tweet;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
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

		service = module.get<TweetService>(TweetService);
		repository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('can get all', async () => {
		const opinion = createOpinion();
		jest.spyOn(repository, 'find').mockResolvedValueOnce([opinion]);
		expect(await service.get()).toEqual([opinion]);
	});

	it('can get one', async () => {
		const opinion = createOpinion();
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(opinion);
		expect(await service.getOne(opinion.id)).toEqual(opinion);
	});

	it('can delete', async () => {
		const deleteSpy = jest.spyOn(repository, 'clear').mockImplementation();
		await service.delete();
		expect(deleteSpy).toBeCalled();
	});

	it('can update', async () => {
		const opinion = createOpinion();
		const findSpy = jest.spyOn(repository, 'findOne').mockResolvedValueOnce(opinion);
		const updateSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce(opinion);
		const createSpy = jest.spyOn(repository, 'create').mockReturnValue(opinion);
		await service.update(opinion);
		expect(updateSpy).toBeCalledWith(opinion);
		expect(findSpy).toBeCalledWith(opinion.id);
		expect(createSpy).toBeCalled();
	});
});
