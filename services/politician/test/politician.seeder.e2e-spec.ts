import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PoliticiansService } from '../src/politicians/politicians.service';
import { Role } from '../src/politicians/politicians.entity';
import { CreatePoliticianDto } from '../src/politicians/dto/create-politician.dto';
import PoliticianSeeder from '../src/politicians/seeder/politician.seeder';

let app: INestApplication;
let service: PoliticiansService;
let seeder: PoliticianSeeder;

let id = 1;

function createPoliticianDto() {
	id++;
	return {
		name: `Politician ${id}`,
		party: `Party ${id}`,
		role: Role.SENATOR.toString(),
		active: true,
	} as CreatePoliticianDto;
}

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	service = moduleFixture.get<PoliticiansService>(PoliticiansService);
	seeder = moduleFixture.get<PoliticianSeeder>(PoliticianSeeder);

	await app.init();
});

afterAll(async () => {
	await app.close();
});

beforeEach(async () => {
	await service.delete();
});

describe('PoliticianSeeder (e2e)', () => {
	it('Seed from empty', async () => {
		const newPoliticians = [createPoliticianDto(), createPoliticianDto()];

		await seeder.updatePoliticianList(newPoliticians);

		const politicians = await service.get();
		politicians.forEach(x => delete x.id);

		expect(politicians).toEqual(newPoliticians);
	});

	it('Seed with existing', async () => {
		const newPoliticians: CreatePoliticianDto[] = [
			{
				name: 'Politician 1',
				party: 'Republican',
				active: true,
				role: Role.SENATOR
			},
			{
				name: 'Politician 2',
				party: 'Republican',
				active: true,
				role: Role.SENATOR
			}
		];

		const existingPoliticians: CreatePoliticianDto[] = [
			{
				name: 'Politician 1',
				party: 'Democratic',
				active: true,
				role: Role.SENATOR
			},
			{
				name: 'Politician 3',
				party: 'Republican',
				active: true,
				role: Role.SENATOR
			}
		]

		for (const existingPolitician of existingPoliticians) {
			await service.insert(existingPolitician);
		}

		await seeder.updatePoliticianList(newPoliticians);

		const politicians = await service.get();
		politicians.forEach(x => delete x.id);

		expect(politicians).toEqual(newPoliticians);
	});
});
