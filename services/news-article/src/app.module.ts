import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsArticleModule } from './news-article/news-article.module';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './terminus-options/terminus-options.service';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		NewsArticleModule,
		TerminusModule.forRootAsync({
			useClass: TerminusOptionsService,
		}),
	],
})
export class AppModule {
}
