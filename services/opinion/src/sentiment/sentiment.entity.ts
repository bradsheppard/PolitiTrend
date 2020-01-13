import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Opinion } from '../opinion/opinion.entity';

@Entity()
export class Sentiment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	politician: number;

	@Column({ type: 'double precision' })
	value: number;

	@ManyToOne(type => Opinion, opinion => opinion.sentiments, { onDelete: 'CASCADE'})
	opinion: Opinion;
}
