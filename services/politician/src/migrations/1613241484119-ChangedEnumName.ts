import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedEnumName1613241484119 implements MigrationInterface {
	name = 'ChangedEnumName1613241484119';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TYPE "public"."politician_role_enum" RENAME TO "politician_role_enum_old"`,
		);
		await queryRunner.query(
			`CREATE TYPE "politician_role_enum" AS ENUM('Senator', 'President', 'Presidential Candidate', 'Former President', 'Congressmember')`,
		);
		await queryRunner.query(
			`ALTER TABLE "politician" ALTER COLUMN "role" TYPE "politician_role_enum" USING "role"::"text"::"politician_role_enum"`,
		);
		await queryRunner.query(`DROP TYPE "politician_role_enum_old"`);
		await queryRunner.query(
			`COMMENT ON COLUMN "politician"."role" IS NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`COMMENT ON COLUMN "politician"."role" IS NULL`,
		);
		await queryRunner.query(
			`CREATE TYPE "politician_role_enum_old" AS ENUM('Senator', 'President', 'Presidential Candidate', 'Former President', 'Congressman')`,
		);
		await queryRunner.query(
			`ALTER TABLE "politician" ALTER COLUMN "role" TYPE "politician_role_enum_old" USING "role"::"text"::"politician_role_enum_old"`,
		);
		await queryRunner.query(`DROP TYPE "politician_role_enum"`);
		await queryRunner.query(
			`ALTER TYPE "politician_role_enum_old" RENAME TO  "politician_role_enum"`,
		);
	}
}
