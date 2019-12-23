import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1577064629147 implements MigrationInterface {
    name = 'Initial1577064629147'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "opinion" ("id" SERIAL NOT NULL, "politician" integer NOT NULL, "sentiment" double precision NOT NULL, "tweetId" character varying NOT NULL, "tweetText" character varying NOT NULL, CONSTRAINT "UQ_3602237659b3b93bee1ef59afbb" UNIQUE ("tweetId"), CONSTRAINT "PK_5ec733c275c9b9322cde468b4c1" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6668b702d6bbc01b3d4a683795" ON "opinion" ("politician") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3602237659b3b93bee1ef59afb" ON "opinion" ("tweetId") `, undefined);
        await queryRunner.query(`CREATE TABLE "opinion_summary" ("id" SERIAL NOT NULL, "politician" integer NOT NULL, "sentiment" double precision NOT NULL, CONSTRAINT "PK_48a50f5f23d56c71f85f59b3979" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a0dd91ac07d0a22f948091cd7f" ON "opinion_summary" ("politician") `, undefined);
        await queryRunner.query(`CREATE TYPE "opinion_summary_job_status_enum" AS ENUM('NotStarted', 'InProgress', 'Completed', 'Error')`, undefined);
        await queryRunner.query(`CREATE TABLE "opinion_summary_job" ("id" SERIAL NOT NULL, "status" "opinion_summary_job_status_enum" NOT NULL DEFAULT 'NotStarted', "politician" integer NOT NULL, "opinionSummary" integer, CONSTRAINT "PK_da261fad75ec2f092b665ade00b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_59c04b5118e7e2785a288629de" ON "opinion_summary_job" ("politician") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_59c04b5118e7e2785a288629de"`, undefined);
        await queryRunner.query(`DROP TABLE "opinion_summary_job"`, undefined);
        await queryRunner.query(`DROP TYPE "opinion_summary_job_status_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a0dd91ac07d0a22f948091cd7f"`, undefined);
        await queryRunner.query(`DROP TABLE "opinion_summary"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3602237659b3b93bee1ef59afb"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6668b702d6bbc01b3d4a683795"`, undefined);
        await queryRunner.query(`DROP TABLE "opinion"`, undefined);
    }

}
