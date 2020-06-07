import { Module } from '@nestjs/common';
import { TweetModule } from './tweet/tweet.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		TweetModule
	],
})
export class AppModule {
}
