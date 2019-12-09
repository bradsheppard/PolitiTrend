import {MigrationInterface, QueryRunner} from "typeorm";

export class SentimentDouble1575913431249 implements MigrationInterface {
    name = 'SentimentDouble1575913431249'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "sentiment"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "sentiment" double precision NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "opinion" DROP COLUMN "sentiment"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" ADD "sentiment" integer NOT NULL`, undefined);
    }

}
