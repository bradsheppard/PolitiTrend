import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();

	await app.init();
});

describe('TerminusOptions (e2e)', () => {
	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/health');

		expect(response.status).toEqual(200);
	});
});
