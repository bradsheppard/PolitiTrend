import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1573001137532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "opinion" ("id" SERIAL NOT NULL, "politician" integer NOT NULL, "sentiment" integer NOT NULL, "tweet" integer NOT NULL, CONSTRAINT "PK_5ec733c275c9b9322cde468b4c1" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "opinion"`, undefined);
    }

}
