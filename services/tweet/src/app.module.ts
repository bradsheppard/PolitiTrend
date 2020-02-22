import { Module } from '@nestjs/common';
import { TweetModule } from './tweet/tweet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentModule } from './sentiment/sentiment.module';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './terminus-options/terminus-options.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    SentimentModule,
    TweetModule,
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
  ],
})
export class AppModule {}
