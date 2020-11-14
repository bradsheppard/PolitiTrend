import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreatePoliticianDto } from '../src/politicians/dto/create-politician.dto';
import { PoliticiansService } from '../src/politicians/politicians.service';
import Politician, { Role } from '../src/politicians/politicians.entity';

let app: INestApplication;
let service: PoliticiansService;

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
	await app.init();
});

afterAll(async () => {
	await app.close();
});

beforeEach(async () => {
	await service.delete();
});

describe('PoliticianController (e2e)', () => {
	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer()).get('/');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const politicianDto = createPoliticianDto();
		const res = await request(app.getHttpServer())
			.post('/')
			.send(politicianDto);

		const resultingPolitician = res.body as Politician;
		const insertedPolitician = politicianDto as Politician;
		insertedPolitician.id = resultingPolitician.id;

		expect(res.status).toEqual(201);
		expect(resultingPolitician).toEqual(insertedPolitician);
	});

	it('/{id} (PUT)', async () => {
		const politicianDto: CreatePoliticianDto = {
			name: 'Politician 1',
			party: 'Party 1',
			role: Role.SENATOR,
			active: true,
		};

		const insertedPolitician = await service.insert(politicianDto);

		const updatedPoliticianDto: CreatePoliticianDto = {
			name: 'Politician 1 Updated',
			party: 'Party 1 Updated',
			role: Role.CONGRESSMAN,
			active: true,
		};

		await request(app.getHttpServer())
			.put(`/${insertedPolitician.id}`)
			.send(updatedPoliticianDto);
		const databasePolitician = await service.getOne(insertedPolitician.id);

		expect(databasePolitician).toEqual(
			Object.assign(updatedPoliticianDto, { id: databasePolitician.id }),
		);
	});
});

describe('TweetService (e2e)', () => {
	it('Can get all', async () => {
		const politician1 = createPoliticianDto();
		const politician2 = createPoliticianDto();

		const firstInsert = await service.insert(politician1);
		const secondInsert = await service.insert(politician2);

		const tweets = await service.get();

		expect(tweets).toEqual([firstInsert, secondInsert]);
	});

	it('Can update', async () => {
		const politicianDto: CreatePoliticianDto = {
			name: 'Politician 1',
			party: 'Party 1',
			role: Role.SENATOR,
			active: true,
		};

		const insertedPolitician = await service.insert(politicianDto);

		const updatedPoliticianDto: CreatePoliticianDto = {
			name: 'Politician 1 Updated',
			party: 'Party 1 Updated',
			role: Role.CONGRESSMAN,
			active: true,
		};

		await service.update(insertedPolitician.id, updatedPoliticianDto);
		const databasePolitician = await service.getOne(insertedPolitician.id);

		expect(databasePolitician).toEqual(
			Object.assign(updatedPoliticianDto, { id: databasePolitician.id }),
		);
	});

	it('Can get when nothing exists', async () => {
		const tweets = await service.get();

		expect(tweets).toHaveLength(0);
	});

	it('Can get', async () => {
		const politician = createPoliticianDto();
		const insertedPolitician = await service.insert(politician);

		const retrievedPolitician = await service.getOne(insertedPolitician.id);
		expect(retrievedPolitician).toEqual(insertedPolitician);
	});

	it('Can delete one', async () => {
		const politician1 = createPoliticianDto();
		const politician2 = createPoliticianDto();

		const [, insertedPolitician2] = await Promise.all([
			service.insert(politician1),
			service.insert(politician2),
		]);

		await service.deleteOne(insertedPolitician2.id);

		const politicians = await service.get();

		expect(politicians.length).toEqual(1);
		expect(politicians[0]).toEqual(
			Object.assign(politician1, { id: politicians[0].id }),
		);
	});
});
