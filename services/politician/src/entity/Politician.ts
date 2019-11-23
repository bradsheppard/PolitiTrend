import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export default class Politician {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    party: string;

    @Column()
    sentiment: number;
}
