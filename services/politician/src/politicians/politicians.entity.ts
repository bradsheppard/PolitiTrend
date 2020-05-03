import { Entity, Column, PrimaryColumn } from 'typeorm';

export enum Role {
	SENATOR = 'Senator',
	PRESIDENT = 'President',
	PRESIDENTIAL_CANDIDATE = 'Presidential Candidate'
}

@Entity()
export default class Politician {
	@PrimaryColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	party: string;

	@Column({
		type: 'enum',
		enum: Role
	})
	role: Role
}
