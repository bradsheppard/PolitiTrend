import { Test, TestingModule } from '@nestjs/testing';
import { SentimentController } from './sentiment.controller';
import { getModelToken } from '@nestjs/mongoose';
import { SentimentService } from './sentiment.service';
import { Sentiment } from './interfaces/sentiment.interface';
import { CreateSentimentDto } from './dtos/create-sentiment.dto';

describe('Sentiment Controller', () => {
	let controller: SentimentController;
	let service: SentimentService;

	let id = 0;

	function createSentiment(): Sentiment {
		id++;
		return {
			id,
			politician: id,
			sentiment: id,
			dateTime: new Date(),
			sampleSize: id + 100
		} as Sentiment;
	}

	function createSentimentDto(): CreateSentimentDto {
		id++;
		return {
			politician: id,
			sentiment: id,
			sampleSize: id + 100
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SentimentController],
			providers: [
				SentimentService,
				{
					provide: getModelToken('Sentiment'),
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<SentimentController>(SentimentController);
		service = module.get<SentimentService>(SentimentService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('Can get all', async () => {
		const sentiment = createSentiment();
		jest.spyOn(service, 'findAll').mockResolvedValueOnce([sentiment]);
		expect(await controller.findAll({})).toEqual([sentiment]);
	});

	it('Can get by politician', async () => {
		const sentiment = createSentiment();
		jest.spyOn(service, 'findByPolitician').mockResolvedValueOnce([sentiment]);
		expect(await controller.findAll({politician: sentiment.politician})).toEqual([sentiment]);
	});

	it('Can handle sentiment created', async () => {
		const sentiment = createSentiment();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.handleSentimentCreated(sentiment);
		expect(insertSpy).toBeCalled();
	});

	it('Can create sentiment', async () => {
		const createDto = createSentimentDto();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.create(createDto);
		expect(insertSpy).toBeCalled();
	});
});
