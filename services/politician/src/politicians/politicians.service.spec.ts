import { Test, TestingModule } from '@nestjs/testing';
import { PoliticiansService } from './politicians.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Politician, { Role } from './politicians.entity';
import { Repository } from 'typeorm';

describe('PoliticiansService', () => {
	let service: PoliticiansService;
	let repository: Repository<Politician>;

	let id = 1;

	function createPolitician(): Politician {
		id++;
		return {
			party: 'republican',
			id,
			name: `Test ${id}`,
			role: Role.SENATOR,
			active: true,
		};
	}

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PoliticiansService,
				{
					provide: getRepositoryToken(Politician),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<PoliticiansService>(PoliticiansService);
		repository = module.get<Repository<Politician>>(
			getRepositoryToken(Politician),
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Can get politicians', async () => {
		const politician = createPolitician();
		jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([
			[politician],
			1,
		]);
		const responseDto = await service.get({});

		expect(responseDto.data.length).toBeGreaterThan(0);
	});

	it('Can get specific politician', async () => {
		const politician = createPolitician();
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(politician);
		const retrievedPolitician = await service.getOne(politician.id);

		expect(retrievedPolitician).toEqual(politician);
	});

	it('Can insert', async () => {
		const politician = createPolitician();
		jest.spyOn(repository, 'create').mockReturnValueOnce(politician);
		jest.spyOn(repository, 'save').mockResolvedValueOnce(politician);
		const createdPolitician = await service.insert(politician);

		expect(createdPolitician).toEqual(politician);
	});

	it('Can update', async () => {
		const politician = createPolitician();
		jest.spyOn(repository, 'create').mockReturnValueOnce(politician);
		jest.spyOn(repository, 'update').mockImplementation();
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(politician);
		const updatedPolitician = await service.update(
			politician.id,
			politician,
		);

		expect(updatedPolitician).toEqual(politician);
	});
});
