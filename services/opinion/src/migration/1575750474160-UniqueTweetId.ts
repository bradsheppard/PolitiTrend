import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueTweetId1575750474160 implements MigrationInterface {
    name = 'UniqueTweetId1575750474160'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "opinion" ADD CONSTRAINT "UQ_3602237659b3b93bee1ef59afbb" UNIQUE ("tweetId")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6668b702d6bbc01b3d4a683795" ON "opinion" ("politician") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_6668b702d6bbc01b3d4a683795"`, undefined);
        await queryRunner.query(`ALTER TABLE "opinion" DROP CONSTRAINT "UQ_3602237659b3b93bee1ef59afbb"`, undefined);
    }

}
