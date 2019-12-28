import { Test, TestingModule } from '@nestjs/testing';
import { PoliticiansController } from './politicians.controller';
import { PoliticiansService } from './politicians.service';
import { getRepositoryToken} from '@nestjs/typeorm';
import Politician from './politicians.entity';
import { Repository } from 'typeorm';

describe('Politicians Controller', () => {
	let controller: PoliticiansController;
	let service: PoliticiansService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PoliticiansController],
			providers: [PoliticiansService,
				{
					provide: getRepositoryToken(Politician),
					useClass: Repository,
				},
			],

		}).compile();

		controller = module.get<PoliticiansController>(PoliticiansController);
		service = module.get<PoliticiansService>(PoliticiansService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('can get all', async () => {
		const result = [{
			id: 1,
			name: 'Test Name',
			sentiment: 0,
			party: 'Republican',
		}];
		jest.spyOn(service, 'get').mockImplementation(async () => result);
		expect(await controller.getPoliticians()).toBe(result);
	});

	it('Can get single', async () => {
		const result = {
			id: 1,
			name: 'Test Name',
			sentiment: 0,
			party: 'Republican',
		};
		jest.spyOn(service, 'getOne').mockImplementation(async () => result);
		expect(await controller.getPolitician('1')).toBe(result);
	});
});
