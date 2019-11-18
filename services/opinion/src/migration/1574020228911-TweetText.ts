import {MigrationInterface, QueryRunner} from "typeorm";

export class TweetText1574020228911 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "tweet"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "tweetId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "tweetText" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "tweetText"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "tweetId"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "tweet" integer NOT NULL`, undefined);
    }

}
