import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSummary1598481085674 implements MigrationInterface {
    name = 'AddSummary1598481085674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" ADD "summary" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "summary"`);
    }

}
