import {MigrationInterface, QueryRunner} from "typeorm";

export class RoleAdd1588518942260 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "politician_role_enum" AS ENUM('Senator', 'President', 'Presidential Candidate')`, undefined);
        await queryRunner.query(`ALTER TABLE "politician" ADD "role" "politician_role_enum" NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "politician" DROP COLUMN "role"`, undefined);
        await queryRunner.query(`DROP TYPE "politician_role_enum"`, undefined);
    }

}
