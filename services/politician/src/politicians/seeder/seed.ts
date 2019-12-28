import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import PoliticianSeeder from './politician.seeder';

(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const seeder = moduleFixture.get<PoliticianSeeder>(PoliticianSeeder);
	await seeder.seed();
})();
