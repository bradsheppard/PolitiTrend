import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum Role {
	SENATOR = 'Senator',
	PRESIDENT = 'President',
	PRESIDENTIAL_CANDIDATE = 'Presidential Candidate',
	CONGRESSMAN = 'Congressman',
}

@Entity()
export default class Politician {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	party: string;

	@Column({
		type: 'enum',
		enum: Role,
	})
	role: Role;

	@Index()
	@Column({ default: true })
	active: boolean;
}
