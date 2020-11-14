import { Test, TestingModule } from '@nestjs/testing';
import { PoliticiansController } from './politicians.controller';
import { PoliticiansService } from './politicians.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Politician, { Role } from './politicians.entity';
import { Repository } from 'typeorm';
import { CreatePoliticianDto } from './dto/create-politician.dto';

describe('Politicians Controller', () => {
	let controller: PoliticiansController;
	let service: PoliticiansService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PoliticiansController],
			providers: [
				PoliticiansService,
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
		const result = [
			{
				id: 1,
				name: 'Test Name',
				sentiment: 0,
				party: 'Republican',
				role: Role.SENATOR,
				active: true,
			},
		];
		jest.spyOn(service, 'get').mockImplementation(async () => result);
		expect(await controller.getPoliticians()).toBe(result);
	});

	it('Can get single', async () => {
		const result = {
			id: 1,
			name: 'Test Name',
			sentiment: 0,
			party: 'Republican',
			role: Role.SENATOR,
			active: true,
		};
		jest.spyOn(service, 'getOne').mockImplementation(async () => result);
		expect(await controller.getPolitician('1')).toBe(result);
	});

	it('Can insert', async () => {
		const result = {
			id: 1,
			name: 'Test Name',
			sentiment: 0,
			party: 'Republican',
			role: Role.SENATOR,
			active: true,
		};

		const creationDto: CreatePoliticianDto = {
			name: 'Test Name',
			party: 'Republican',
			role: Role.SENATOR,
			active: true,
		};

		jest.spyOn(service, 'insert').mockImplementation(async () => result);
		expect(await controller.insert(creationDto)).toBe(result);
	});

	it('Can update', async () => {
		const result = {
			id: 1,
			name: 'Test Name',
			sentiment: 0,
			party: 'Republican',
			role: Role.SENATOR,
			active: true,
		};

		const creationDto: CreatePoliticianDto = {
			name: 'Test Name',
			party: 'Republican',
			role: Role.SENATOR,
			active: true,
		};

		jest.spyOn(service, 'update').mockImplementation(async () => result);
		expect(await controller.updatePolitician('1', creationDto)).toBe(
			result,
		);
	});
});
