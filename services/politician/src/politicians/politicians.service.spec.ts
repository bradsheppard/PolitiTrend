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
		return {
			party: 'republican',
			id,
			name: `Test ${id}`,
			role: Role.SENATOR
		}
	}

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PoliticiansService,
				{
					provide: getRepositoryToken(Politician),
					useClass: Repository,
				}
			],
		}).compile();

		service = module.get<PoliticiansService>(PoliticiansService);
		repository = module.get<Repository<Politician>>(getRepositoryToken(Politician));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Can get politicians', async () => {
		const politician = createPolitician();
		jest.spyOn(repository, 'find').mockResolvedValueOnce([politician]);
		const politicians = await service.get();

		expect(politicians.length).toBeGreaterThan(0);
	});

	it('Can get specific politician', async () => {
		const politician = createPolitician();
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(politician);
		const retrievedPolitician = await service.getOne(politician.id);

		expect(retrievedPolitician).toEqual(politician);
	});
});
