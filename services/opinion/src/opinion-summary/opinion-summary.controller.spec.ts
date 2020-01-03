import { Test, TestingModule } from '@nestjs/testing';
import { OpinionSummaryController } from './opinion-summary.controller';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpinionSummaryService } from './opinion-summary.service';
import OpinionSummary from './opinion-summary.entity';
import { HttpException } from '@nestjs/common';

describe('OpinionSummary Controller', () => {
	let controller: OpinionSummaryController;
	let service: OpinionSummaryService;

	let id = 0;

	function createOpinionSummary() {
		id++;
		return {
			id,
			politician: id,
			sentiment: id,
		} as OpinionSummary;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OpinionSummaryController],
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

		controller = module.get<OpinionSummaryController>(OpinionSummaryController);
		service = module.get<OpinionSummaryService>(OpinionSummaryService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('can get all', async () => {
		const opinionSummary = createOpinionSummary();
		jest.spyOn(service, 'get').mockResolvedValueOnce([opinionSummary]);
		expect(await controller.findAll()).toEqual([opinionSummary]);
	});

	it('can get one when exists', async () => {
		const opinionSummary = createOpinionSummary();
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(opinionSummary);
		expect(await controller.findOne(opinionSummary.id.toString())).toEqual(opinionSummary);
	});

	it('cant get returns 404 when not exists', async () => {
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(null);
		await expect(controller.findOne('1')).rejects.toThrowError(new HttpException('Not found', 404));
	});
});
