import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1584403261025 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "politician" ("id" integer NOT NULL, "name" character varying NOT NULL, "party" character varying NOT NULL, CONSTRAINT "PK_654235be4a84d4100933e6c4f41" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "politician"`, undefined);
    }

}
