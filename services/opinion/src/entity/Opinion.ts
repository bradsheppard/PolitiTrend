import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export default class Opinion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    politician: number;

    @Column()
    sentiment: number;

    @Index()
    @Column()
    tweetId: string;

    @Column()
    tweetText: string;
}