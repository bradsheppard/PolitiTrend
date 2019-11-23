import {MigrationInterface, QueryRunner} from "typeorm";

export class PrimaryKeyChange1574547683101 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "politician" ALTER COLUMN "id" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP SEQUENCE "politician_id_seq"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE SEQUENCE "politician_id_seq" OWNED BY "politician"."id"`, undefined);
        await queryRunner.query(`ALTER TABLE "politician" ALTER COLUMN "id" SET DEFAULT nextval('politician_id_seq')`, undefined);
    }

}
