import { Test, TestingModule } from '@nestjs/testing';
import { PoliticiansService } from './politicians.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Politician from './politicians.entity';

describe('PoliticiansService', () => {
	let service: PoliticiansService;
	let id = 1;

	function createPolitician(): Politician {
		return {
			party: 'republican',
			sentiment: id,
			id,
			name: `Test ${id}`
		}
	}

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PoliticiansService],
			imports: [
				TypeOrmModule.forRoot(),
				TypeOrmModule.forFeature([Politician])
			]
		}).compile();

		service = module.get<PoliticiansService>(PoliticiansService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Can get politicians', async () => {
		const politician = createPolitician();
		await service.insert(politician);
		const politicians = await service.get();

		expect(politicians.length).toBeGreaterThan(0);
	});

	it('Can get specific politician', async () => {
		const politician = createPolitician();
		await service.insert(politician);
		const retrievedPolitician = await service.getOne(politician.id);

		expect(retrievedPolitician).toEqual(politician);
	});
});
