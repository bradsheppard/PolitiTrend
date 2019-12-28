import { Test, TestingModule } from '@nestjs/testing';
import { PoliticiansService } from './politicians.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Politician from './politicians.entity';
import { Repository } from 'typeorm';

describe('PoliticiansService', () => {
	let service: PoliticiansService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PoliticiansService,
				{
					provide: getRepositoryToken(Politician),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<PoliticiansService>(PoliticiansService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
