import { Column, Index, Unique, ChildEntity } from 'typeorm';
import { Opinion } from '../opinion/opinion.entity';

@ChildEntity()
@Unique(['tweetId'])
export default class Tweet extends Opinion {
	@Index()
	@Column()
	tweetId: string;

	@Column()
	tweetText: string;
}
