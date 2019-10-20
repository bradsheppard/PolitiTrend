import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Politician {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    party: string;

    @Column()
    sentiment: number;
}
