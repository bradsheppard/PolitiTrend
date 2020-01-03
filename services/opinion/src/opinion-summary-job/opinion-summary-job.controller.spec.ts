import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { OpinionSummaryJobService } from './opinion-summary-job.service';
import { OpinionSummaryJobController } from './opinion-summary-job.controller';
import OpinionSummaryJob, { JobStatus } from './opinion-summary-job.entity';
import { OpinionService } from '../opinion/opinion.service';
import { OpinionSummaryService } from '../opinion-summary/opinion-summary.service';
import OpinionSummary from '../opinion-summary/opinion-summary.entity';
import Opinion from '../opinion/opinion.entity';

describe('OpinionSummaryJob Controller', () => {
	let controller: OpinionSummaryJobController;
	let opinionSummaryJobService: OpinionSummaryJobService;
	let opinionSummaryService: OpinionSummaryService;
	let opinionService: OpinionService;

	let id = 0;

	function createOpinionSummaryJob() {
		id++;
		return {
			id,
			status: JobStatus.InProgress,
			opinionSummary: id,
			politician: id,
		} as OpinionSummaryJob;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OpinionSummaryJobController],
			providers: [OpinionSummaryJobService, OpinionSummaryService, OpinionService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(OpinionSummaryJob),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(OpinionSummary),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Opinion),
					useClass: Repository,
				},
			],
		}).compile();

		controller = module.get<OpinionSummaryJobController>(OpinionSummaryJobController);
		opinionSummaryJobService = module.get<OpinionSummaryJobService>(OpinionSummaryJobService);
		opinionSummaryService = module.get<OpinionSummaryService>(OpinionSummaryService);
		opinionService = module.get<OpinionService>(OpinionService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(opinionSummaryJobService).toBeDefined();
	});

	it('can get all', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		jest.spyOn(opinionSummaryJobService, 'get').mockResolvedValueOnce([opinionSummaryJob]);
		expect(await controller.findAll()).toEqual([opinionSummaryJob]);
	});

	it('can get one when exists', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		jest.spyOn(opinionSummaryJobService, 'getOne').mockResolvedValueOnce(opinionSummaryJob);
		expect(await controller.findOne(opinionSummaryJob.id.toString())).toEqual(opinionSummaryJob);
	});

	it('cant get returns 404 when not exists', async () => {
		jest.spyOn(opinionSummaryJobService, 'getOne').mockResolvedValueOnce(null);
		await expect(controller.findOne('1')).rejects.toThrowError(new HttpException('Not found', 404));
	});

	it('can create, job error when no opinions', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		jest.spyOn(opinionService, 'getSentimentAverageForPolitician').mockResolvedValueOnce(null);
		jest.spyOn(opinionSummaryJobService, 'insert').mockResolvedValueOnce(opinionSummaryJob);
		jest.spyOn(opinionSummaryJobService, 'update').mockImplementation();

		const resultingJob = await controller.create(opinionSummaryJob);
		expect(resultingJob.status).toEqual(JobStatus.Error);
	});

	it('can create, job error when no opinions', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		jest.spyOn(opinionService, 'getSentimentAverageForPolitician').mockResolvedValueOnce(5);
		jest.spyOn(opinionSummaryService, 'insert').mockImplementation();
		jest.spyOn(opinionSummaryJobService, 'insert').mockResolvedValueOnce(opinionSummaryJob);
		jest.spyOn(opinionSummaryJobService, 'update').mockImplementation();

		const resultingJob = await controller.create(opinionSummaryJob);
		expect(resultingJob.status).toEqual(JobStatus.Completed);
	});
});
