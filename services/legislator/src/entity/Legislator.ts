import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Legislator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    party: string;
}
