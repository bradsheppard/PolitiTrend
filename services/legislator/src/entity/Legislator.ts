import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Legislator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}
