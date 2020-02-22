import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Tweet from '../tweet/tweet.entity';

@Entity()
export class Sentiment {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column()
	politician: number;

	@Column({ type: 'double precision' })
	value: number;

	@Index()
	@ManyToOne(() => Tweet, tweet => tweet.sentiments, { onDelete: 'CASCADE'})
	tweet: Tweet;
}
