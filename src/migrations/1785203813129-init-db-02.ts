import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb021785203813129 implements MigrationInterface {
    name = 'InitDb021785203813129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`deleted\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu\` ADD \`deleted\` tinyint NOT NULL COMMENT '是否删除(0:未删除,1:已删除)' DEFAULT '0'`);
    }

}
