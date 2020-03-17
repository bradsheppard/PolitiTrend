import {MigrationInterface, QueryRunner} from "typeorm";
import PoliticianSeeder from '../politicians/seeder/politician.seeder';
import Politician from '../politicians/politicians.entity';

export class AddData1584403797886 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const politicians = await PoliticianSeeder.getPoliticians();

        for(let politician of politicians) {
            const politicianEntity = queryRunner.manager.create(Politician, politician);
            await queryRunner.manager.save(politicianEntity)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
