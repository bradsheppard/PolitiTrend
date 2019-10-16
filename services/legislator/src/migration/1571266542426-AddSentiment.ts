import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSentiment1571266542426 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "legislator" ADD "sentiment" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "legislator" DROP COLUMN "sentiment"`, undefined);
    }

}
