import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1570405597243 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "legislator" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "party" character varying NOT NULL, CONSTRAINT "PK_f890e2210b2b610357e2d6837cf" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "legislator"`, undefined);
    }
}
