import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719129881633 implements MigrationInterface {
  name = 'Migration1719129881633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "job_location" ("id" character varying NOT NULL, "label" character varying(255), CONSTRAINT "PK_9331dcc9601546cc211e12d9be6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "job_location"`);
  }
}
