import {MigrationInterface, QueryRunner} from "typeorm";

export class IndexTweetPoliticiansArray1598298132418 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION intarray`);
        await queryRunner.query(`CREATE EXTENSION btree_gin`);
        await queryRunner.query(`CREATE INDEX "IDX_TWEET_POLITICIANS" ON "tweet" USING GIN(politicians gin__int_ops, "dateTime") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_TWEET_POLITICIANS"`);
        await queryRunner.query(`DROP EXTENSION btree_gin CASCADE`);
        await queryRunner.query(`DROP EXTENSION intarray CASCADE`);
    }

}
