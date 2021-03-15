import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreatePoliticianDto } from '../src/politicians/dto/create-politician.dto';
import { PoliticiansService } from '../src/politicians/politicians.service';
import Politician, { Role } from '../src/politicians/politicians.entity';
import PoliticianSeeder from '../src/politicians/seeder/politician.seeder';
import { ResponseDto } from '../src/politicians/dto/response.dto';

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

function createPoliticianDtoByRole(role: Role) {
	id++;
	return {
		name: `Politician ${id}`,
		party: `Party ${id}`,
		role: role.toString(),
		active: true,
	} as CreatePoliticianDto;
}

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.useGlobalPipes(
		new ValidationPipe({ transform: true, skipMissingProperties: true }),
	);

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

describe('PoliticianController (e2e)', () => {
	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer()).get('/');

		expect(response.status).toEqual(200);
	});

	it('/active=true (GET)', async () => {
		const activePolitician: CreatePoliticianDto = {
			name: 'Active Politician',
			party: 'Republican',
			role: Role.SENATOR,
			active: true,
		};
		const inactivePolitician: CreatePoliticianDto = {
			name: 'Inactive Politician',
			party: 'Republican',
			role: Role.SENATOR,
			active: false,
		};

		await Promise.all([
			service.insert(activePolitician),
			service.insert(inactivePolitician),
		]);

		const res = await request(app.getHttpServer()).get('/?active=true');
		const responseDto = res.body as ResponseDto;

		delete responseDto.data[0].id;

		expect(res.status).toEqual(200);
		expect(responseDto.data.length).toEqual(1);
		expect(responseDto.data[0]).toEqual(activePolitician);
	});

	it('/role[]=Senator (GET)', async () => {
		const senator = createPoliticianDtoByRole(Role.SENATOR);
		const congressman = createPoliticianDtoByRole(Role.CONGRESSMAN);

		const [insertedSenator] = await Promise.all([
			service.insert(senator),
			service.insert(congressman),
		]);

		const res = await request(app.getHttpServer()).get('/?role[]=Senator');
		const responseDto = res.body as ResponseDto;

		expect(res.status).toEqual(HttpStatus.OK);
		expect(responseDto.data.length).toEqual(1);
		expect(responseDto.data).toContainEqual(insertedSenator);
	});

	it('/role[]=Senator&role[]=Congressman (GET)', async () => {
		const senator = createPoliticianDtoByRole(Role.SENATOR);
		const congressman = createPoliticianDtoByRole(Role.CONGRESSMAN);
		const president = createPoliticianDtoByRole(Role.PRESIDENT);

		const [insertedSenator, insertedCongressman] = await Promise.all([
			service.insert(senator),
			service.insert(congressman),
			service.insert(president),
		]);

		const res = await request(app.getHttpServer()).get(
			'/?role[]=Senator&role[]=Congressman',
		);
		const responseDto = res.body as ResponseDto;

		expect(res.status).toEqual(HttpStatus.OK);
		expect(responseDto.data.length).toEqual(2);
		expect(responseDto.data).toContainEqual(insertedSenator);
		expect(responseDto.data).toContainEqual(insertedCongressman);
	});

	it('/role[]=invalid (GET)', async () => {
		const res = await request(app.getHttpServer()).get('/?role[]=invalid');
		expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
	});

	it('/limit=2 (GET)', async () => {
		const politician1 = createPoliticianDto();
		const politician2 = createPoliticianDto();
		const politician3 = createPoliticianDto();

		const insertedPolitician1 = await service.insert(politician1);
		const insertedPolitician2 = await service.insert(politician2);
		await service.insert(politician3);

		const res = await request(app.getHttpServer()).get('/?limit=2');
		const responseDto = res.body as ResponseDto;

		expect(res.status).toEqual(HttpStatus.OK);
		expect(responseDto.data.length).toEqual(2);
		expect(responseDto.meta.count).toEqual(3);
		expect(responseDto.data).toContainEqual(insertedPolitician1);
		expect(responseDto.data).toContainEqual(insertedPolitician2);
	});

	it('/limit=2&offset=1 (GET)', async () => {
		const politician1 = createPoliticianDto();
		const politician2 = createPoliticianDto();
		const politician3 = createPoliticianDto();

		await service.insert(politician1);
		const insertedPolitician2 = await service.insert(politician2);
		const insertedPolitician3 = await service.insert(politician3);

		const res = await request(app.getHttpServer()).get(
			'/?limit=2&offset=1',
		);
		const responseDto = res.body as ResponseDto;

		expect(res.status).toEqual(HttpStatus.OK);
		expect(responseDto.data.length).toEqual(2);
		expect(responseDto.meta.count).toEqual(3);
		expect(responseDto.data).toContainEqual(insertedPolitician2);
		expect(responseDto.data).toContainEqual(insertedPolitician3);
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

describe('PoliticianService (e2e)', () => {
	it('Can get all', async () => {
		const politician1 = createPoliticianDto();
		const politician2 = createPoliticianDto();

		const firstInsert = await service.insert(politician1);
		const secondInsert = await service.insert(politician2);

		const responseDto = await service.get({});

		expect(responseDto.data).toEqual([firstInsert, secondInsert]);
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
		const responseDto = await service.get({});

		expect(responseDto.data).toHaveLength(0);
	});

	it('Can get', async () => {
		const politician = createPoliticianDto();
		const insertedPolitician = await service.insert(politician);

		const retrievedPolitician = await service.getOne(insertedPolitician.id);
		expect(retrievedPolitician).toEqual(insertedPolitician);
	});

	it('Can get by role', async () => {
		const senator = createPoliticianDtoByRole(Role.SENATOR);
		const congressman = createPoliticianDtoByRole(Role.CONGRESSMAN);

		const [insertedSenator] = await Promise.all([
			service.insert(senator),
			service.insert(congressman),
		]);

		const responseDto = await service.get({
			role: [Role.SENATOR],
		});
		expect(responseDto.data).toHaveLength(1);
		expect(responseDto.data).toContainEqual(insertedSenator);
	});

	it('Can get by multiple roles', async () => {
		const senator = createPoliticianDtoByRole(Role.SENATOR);
		const congressman = createPoliticianDtoByRole(Role.CONGRESSMAN);
		const president = createPoliticianDtoByRole(Role.PRESIDENT);

		const [insertedSenator, insertedCongressman] = await Promise.all([
			service.insert(senator),
			service.insert(congressman),
			service.insert(president),
		]);

		const responseDto = await service.get({
			role: [Role.SENATOR, Role.CONGRESSMAN],
		});
		expect(responseDto.data).toHaveLength(2);
		expect(responseDto.data).toContainEqual(insertedSenator);
		expect(responseDto.data).toContainEqual(insertedCongressman);
	});

	it('Can delete one', async () => {
		const politician1 = createPoliticianDto();
		const politician2 = createPoliticianDto();

		const [, insertedPolitician2] = await Promise.all([
			service.insert(politician1),
			service.insert(politician2),
		]);

		await service.deleteOne(insertedPolitician2.id);

		const responseDto = await service.get({});

		expect(responseDto.data.length).toEqual(1);
		expect(responseDto.data[0]).toEqual(
			Object.assign(politician1, { id: responseDto.data[0].id }),
		);
	});
});

describe('PoliticianSeeder (e2e)', () => {
	it('Seed from empty', async () => {
		const newPoliticians = [createPoliticianDto(), createPoliticianDto()];

		await seeder.updatePoliticianList(newPoliticians);

		const responseDto = await service.get({});
		responseDto.data.forEach(x => delete x.id);

		expect(responseDto.data).toEqual(newPoliticians);
	});

	it('Seed with existing', async () => {
		const newPoliticians: CreatePoliticianDto[] = [
			{
				name: 'Politician 1',
				party: 'Republican',
				active: true,
				role: Role.SENATOR,
			},
			{
				name: 'Politician 2',
				party: 'Republican',
				active: true,
				role: Role.SENATOR,
			},
		];

		const existingPoliticians: CreatePoliticianDto[] = [
			{
				name: 'Politician 1',
				party: 'Democratic',
				active: true,
				role: Role.SENATOR,
			},
			{
				name: 'Politician 3',
				party: 'Republican',
				active: true,
				role: Role.SENATOR,
			},
		];

		const expectedPoliticians: CreatePoliticianDto[] = [
			{
				name: 'Politician 1',
				party: 'Republican',
				active: true,
				role: Role.SENATOR,
			},
			{
				name: 'Politician 3',
				party: 'Republican',
				active: false,
				role: Role.SENATOR,
			},
			{
				name: 'Politician 2',
				party: 'Republican',
				active: true,
				role: Role.SENATOR,
			},
		];

		for (const existingPolitician of existingPoliticians) {
			await service.insert(existingPolitician);
		}

		await seeder.updatePoliticianList(newPoliticians);

		const responseDto = await service.get({});
		responseDto.data.forEach(x => delete x.id);

		expect(responseDto.data).toEqual(expectedPoliticians);
	});
});
