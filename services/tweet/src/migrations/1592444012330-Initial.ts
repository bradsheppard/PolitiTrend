import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1592444012330 implements MigrationInterface {
    name = 'Initial1592444012330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tweet" ("id" SERIAL NOT NULL, "dateTime" TIMESTAMP NOT NULL, "politicians" integer array NOT NULL, "tweetId" character varying NOT NULL, "tweetText" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "UQ_e7fb403cff8a6a4613e1fbcdb66" UNIQUE ("tweetId"), CONSTRAINT "PK_6dbf0db81305f2c096871a585f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9775be691248365472d8a2ebc7" ON "tweet" ("dateTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_62f207944bafe26fd02bf3e314" ON "tweet" ("politicians") `);
        await queryRunner.query(`CREATE INDEX "IDX_e7fb403cff8a6a4613e1fbcdb6" ON "tweet" ("tweetId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e7fb403cff8a6a4613e1fbcdb6"`);
        await queryRunner.query(`DROP INDEX "IDX_62f207944bafe26fd02bf3e314"`);
        await queryRunner.query(`DROP INDEX "IDX_9775be691248365472d8a2ebc7"`);
        await queryRunner.query(`DROP TABLE "tweet"`);
    }

}
