import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpinionSummaryJobService } from './opinion-summary-job.service';
import OpinionSummaryJob, { JobStatus } from './opinion-summary-job.entity';

describe('OpinionSummaryJobService', () => {
	let service: OpinionSummaryJobService;
	let repository: Repository<OpinionSummaryJob>;

	let id = 0;

	function createOpinionSummaryJob() {
		id++;
		return {
			status: JobStatus.InProgress,
			politician: id,
			opinionSummary: id,
		} as OpinionSummaryJob;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OpinionSummaryJobService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(OpinionSummaryJob),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<OpinionSummaryJobService>(OpinionSummaryJobService);
		repository = module.get<Repository<OpinionSummaryJob>>(getRepositoryToken(OpinionSummaryJob));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('can get all', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		jest.spyOn(repository, 'find').mockResolvedValueOnce([opinionSummaryJob]);
		expect(await service.get()).toEqual([opinionSummaryJob]);
	});

	it('can get one', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(opinionSummaryJob);
		expect(await service.getOne(opinionSummaryJob.id)).toEqual(opinionSummaryJob);
	});

	it('can delete', async () => {
		const deleteSpy = jest.spyOn(repository, 'clear').mockImplementation();
		await service.delete();
		expect(deleteSpy).toBeCalled();
	});

	it('can insert', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertSpy = jest.spyOn(repository, 'save').mockImplementation();
		const createSpy = jest.spyOn(repository, 'create').mockImplementation();

		await service.insert(opinionSummaryJob);
		expect(insertSpy).toBeCalled();
		expect(createSpy).toBeCalledWith(opinionSummaryJob);
	});
});
