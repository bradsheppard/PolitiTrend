import {MigrationInterface, QueryRunner} from "typeorm";

export class TweetIdIndexing1574212664125 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "tweetId"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "tweetId" character varying NOT NULL`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3602237659b3b93bee1ef59afb" ON "opinion" ("tweetId") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_3602237659b3b93bee1ef59afb"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "tweetId"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "tweetId" integer NOT NULL`, undefined);
    }

}
