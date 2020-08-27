import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1598479548361 implements MigrationInterface {
    name = 'Initial1598479548361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news_article" ("id" SERIAL NOT NULL, "dateTime" TIMESTAMP NOT NULL, "politicians" integer array NOT NULL, "url" character varying NOT NULL, "image" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "source" character varying NOT NULL, CONSTRAINT "UQ_c8124b9d4eefd9efeb340dd1b6a" UNIQUE ("url"), CONSTRAINT "PK_12e2ec4b5482dadc50ee88e0da1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54b2021c48c72a3d38cd82db24" ON "news_article" ("dateTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_c8124b9d4eefd9efeb340dd1b6" ON "news_article" ("url") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c8124b9d4eefd9efeb340dd1b6"`);
        await queryRunner.query(`DROP INDEX "IDX_54b2021c48c72a3d38cd82db24"`);
        await queryRunner.query(`DROP TABLE "news_article"`);
    }

}
