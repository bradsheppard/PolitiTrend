import { Column, Index, Unique, Entity, PrimaryGeneratedColumn, OneToMany, ValueTransformer } from 'typeorm';
import { Sentiment } from '../sentiment/sentiment.entity';

export const dateTransformer: ValueTransformer = {
	from: (dbValue: Date) => {
		return dbValue.toUTCString();
	},
	to: (entityValue: string) => new Date(entityValue),
};

@Entity()
@Unique(['tweetId'])
export default class Tweet {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({type: 'timestamp', transformer: dateTransformer})
	dateTime: string;

	@OneToMany(() => Sentiment, sentiment => sentiment.tweet, {cascade: true, eager: true})
	sentiments: Sentiment[];

	@Index()
	@Column()
	tweetId: string;

	@Column()
	tweetText: string;
}
