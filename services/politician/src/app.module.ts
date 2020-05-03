import { Module } from '@nestjs/common';
import { PoliticiansModule } from './politicians/politicians.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		PoliticiansModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'images'),
			serveRoot: '/images'
		})
	],
})
export class AppModule {}
