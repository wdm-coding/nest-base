import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb011777359343377 implements MigrationInterface {
    name = 'InitDb011777359343377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_role\` (\`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`userId\` bigint NOT NULL COMMENT '用户ID', \`roleId\` bigint NOT NULL COMMENT '角色ID', \`assignedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` (\`userId\`), INDEX \`IDX_dba55ed826ef26b5b22bd39409\` (\`roleId\`), UNIQUE INDEX \`IDX_7b4e17a669299579dfa55a3fc3\` (\`userId\`, \`roleId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b4e17a669299579dfa55a3fc3\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_dba55ed826ef26b5b22bd39409\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` ON \`user_role\``);
        await queryRunner.query(`DROP TABLE \`user_role\``);
    }

}
