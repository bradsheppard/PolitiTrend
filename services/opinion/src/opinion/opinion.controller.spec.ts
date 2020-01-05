import { Test, TestingModule } from '@nestjs/testing';
import { OpinionController } from './opinion.controller';
import { OpinionService } from './opinion.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Opinion from './opinion.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('Opinion Controller', () => {
	let controller: OpinionController;
	let service: OpinionService;

	let id = 0;

	function createOpinion() {
		id++;
		return {
			id,
			tweetText: `test text ${id}`,
			sentiment: id + 0.25,
			tweetId: id.toString(),
			politician: id,
		} as Opinion;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OpinionController],
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

		controller = module.get<OpinionController>(OpinionController);
		service = module.get<OpinionService>(OpinionService);
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
