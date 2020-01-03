import { Test, TestingModule } from '@nestjs/testing';
import { OpinionService } from './opinion.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Opinion from './opinion.entity';
import { Repository } from 'typeorm';

describe('Opinion Service', () => {
	let service: OpinionService;
	let repository: Repository<Opinion>;

	let id = 0;

	function createOpinion() {
		id++;
		return {
			tweetText: `test text ${id}`,
			sentiment: id + 0.25,
			tweetId: id.toString(),
			politician: id,
		} as Opinion;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OpinionService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(Opinion),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<OpinionService>(OpinionService);
		repository = module.get<Repository<Opinion>>(getRepositoryToken(Opinion));
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
