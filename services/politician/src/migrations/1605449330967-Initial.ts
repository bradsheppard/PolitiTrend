import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1605449330967 implements MigrationInterface {
    name = 'Initial1605449330967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "politician_role_enum" AS ENUM('Senator', 'President', 'Presidential Candidate', 'Congressman')`);
        await queryRunner.query(`CREATE TABLE "politician" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "party" character varying NOT NULL, "role" "politician_role_enum" NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_654235be4a84d4100933e6c4f41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a928028c71574599e78ba7e1f" ON "politician" ("active") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_6a928028c71574599e78ba7e1f"`);
        await queryRunner.query(`DROP TABLE "politician"`);
        await queryRunner.query(`DROP TYPE "politician_role_enum"`);
    }

}
