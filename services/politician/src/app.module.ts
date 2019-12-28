import { Module } from '@nestjs/common';
import { PoliticiansModule } from './politicians/politicians.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
	imports: [TypeOrmModule.forRoot(), PoliticiansModule],
})
export class AppModule {
	constructor(private readonly connection: Connection) {}
}
