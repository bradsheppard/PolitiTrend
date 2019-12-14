import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1576359160091 implements MigrationInterface {
    name = 'Initial1576359160091'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "job_type_enum" AS ENUM('OpinionSummary')`, undefined);
        await queryRunner.query(`CREATE TYPE "job_status_enum" AS ENUM('NotStarted', 'InProgress', 'Completed', 'Error')`, undefined);
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "type" "job_type_enum" NOT NULL DEFAULT 'OpinionSummary', "status" "job_status_enum" NOT NULL DEFAULT 'NotStarted', CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "opinion" ("id" SERIAL NOT NULL, "politician" integer NOT NULL, "sentiment" double precision NOT NULL, "tweetId" character varying NOT NULL, "tweetText" character varying NOT NULL, CONSTRAINT "UQ_3602237659b3b93bee1ef59afbb" UNIQUE ("tweetId"), CONSTRAINT "PK_5ec733c275c9b9322cde468b4c1" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6668b702d6bbc01b3d4a683795" ON "opinion" ("politician") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3602237659b3b93bee1ef59afb" ON "opinion" ("tweetId") `, undefined);
        await queryRunner.query(`CREATE TABLE "opinion_summary" ("id" SERIAL NOT NULL, "politician" integer NOT NULL, "sentiment" double precision NOT NULL, CONSTRAINT "PK_48a50f5f23d56c71f85f59b3979" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a0dd91ac07d0a22f948091cd7f" ON "opinion_summary" ("politician") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_a0dd91ac07d0a22f948091cd7f"`, undefined);
        await queryRunner.query(`DROP TABLE "opinion_summary"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3602237659b3b93bee1ef59afb"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6668b702d6bbc01b3d4a683795"`, undefined);
        await queryRunner.query(`DROP TABLE "opinion"`, undefined);
        await queryRunner.query(`DROP TABLE "job"`, undefined);
        await queryRunner.query(`DROP TYPE "job_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "job_type_enum"`, undefined);
    }

}
