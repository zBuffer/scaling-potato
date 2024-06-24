import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719122349335 implements MigrationInterface {
  name = 'Migration1719122349335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "job_classification" ("id" character varying NOT NULL, "label" character varying(255), CONSTRAINT "PK_234fd30e60f2b7e7209c7c1af75" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "job_classification"`);
  }
}
