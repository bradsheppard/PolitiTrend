import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class OpinionSummary {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column()
	politician: number;

	@Column({type: 'double precision'})
	sentiment: number;

	@Column('timestamp')
	dateTime: Date;
}
