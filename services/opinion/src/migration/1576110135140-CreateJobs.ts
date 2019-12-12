import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateJobs1576110135140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "job_type_enum" AS ENUM('OpinionSummary')`, undefined);
        await queryRunner.query(`CREATE TYPE "job_status_enum" AS ENUM('NotStarted', 'InProgress', 'Completed')`, undefined);
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "type" "job_type_enum" NOT NULL DEFAULT 'OpinionSummary', "status" "job_status_enum" NOT NULL DEFAULT 'NotStarted', CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "job"`, undefined);
        await queryRunner.query(`DROP TYPE "job_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "job_type_enum"`, undefined);
    }

}
