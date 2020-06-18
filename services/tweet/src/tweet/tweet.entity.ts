import { Column, Index, Unique, Entity, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';

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

	@Index()
	@Column({type: 'int', array: true })
	politicians: number[];

	@Index()
	@Column()
	tweetId: string;

	@Column()
	tweetText: string;

	@Column()
	location: string;
}
