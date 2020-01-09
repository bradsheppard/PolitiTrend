import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity()
@Unique(['tweetId'])
export default class Tweet {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column()
	politician: number;

	@Column({type: 'double precision'})
	sentiment: number;

	@Index()
	@Column()
	tweetId: string;

	@Column()
	tweetText: string;
}
