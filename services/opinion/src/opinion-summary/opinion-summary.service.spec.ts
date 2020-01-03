import { Test, TestingModule } from '@nestjs/testing';
import { OpinionSummaryService } from './opinion-summary.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpinionSummary from './opinion-summary.entity';

describe('OpinionSummaryService', () => {
	let service: OpinionSummaryService;
	let repository: Repository<OpinionSummary>;

	let id = 0;

	function createOpinionSummary() {
		id++;
		return {
			politician: id,
			sentiment: id,
		} as OpinionSummary;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OpinionSummaryService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(OpinionSummary),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<OpinionSummaryService>(OpinionSummaryService);
		repository = module.get<Repository<OpinionSummary>>(getRepositoryToken(OpinionSummary));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('can get all', async () => {
		const opinionSummary = createOpinionSummary();
		jest.spyOn(repository, 'find').mockResolvedValueOnce([opinionSummary]);
		expect(await service.get()).toEqual([opinionSummary]);
	});

	it('can get one', async () => {
		const opinionSummary = createOpinionSummary();
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(opinionSummary);
		expect(await service.getOne(opinionSummary.id)).toEqual(opinionSummary);
	});

	it('can delete', async () => {
		const deleteSpy = jest.spyOn(repository, 'clear').mockImplementation();
		await service.delete();
		expect(deleteSpy).toBeCalled();
	});

	it('can insert', async () => {
		const opinionSummary = createOpinionSummary();
		const insertSpy = jest.spyOn(repository, 'save').mockImplementation();
		const createSpy = jest.spyOn(repository, 'create').mockImplementation();

		await service.insert(opinionSummary);
		expect(insertSpy).toBeCalled();
		expect(createSpy).toBeCalledWith(opinionSummary);
	});
});
