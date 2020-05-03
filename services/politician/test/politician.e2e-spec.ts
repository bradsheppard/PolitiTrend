import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
		id,
		name: `Politician ${id}`,
		party: `Party ${id}`,
		role: Role.SENATOR.toString()
	} as CreatePoliticianDto
}

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			AppModule,
		],
	}).compile();

	app = moduleFixture.createNestApplication();
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
		const response = await request(app.getHttpServer())
			.get('/');

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
});
