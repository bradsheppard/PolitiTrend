import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Opinion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    politician: number;

    @Column()
    sentiment: number;

    @Column()
    tweetId: number;

    @Column()
    tweetText: string;
}