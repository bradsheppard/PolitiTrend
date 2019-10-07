import { container } from '../inversify.config';
import { MigrationInterface, QueryRunner } from 'typeorm';
import SeedExecuter from '../seeder/SeedExecuter';
import { TYPES } from '../types';

export class Initial1570405597243 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "legislator" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "party" character varying NOT NULL, CONSTRAINT "PK_f890e2210b2b610357e2d6837cf" PRIMARY KEY ("id"))`, undefined);

        await queryRunner.commitTransaction();
        const seedExecuter: SeedExecuter = container.get<SeedExecuter>(TYPES.SeedExecuter);
        await seedExecuter.execute();

        await queryRunner.startTransaction();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "legislator"`, undefined);
    }
}
