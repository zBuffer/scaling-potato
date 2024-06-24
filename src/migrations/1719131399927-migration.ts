import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719131399927 implements MigrationInterface {
  name = 'Migration1719131399927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recruitment_brief" ("id" character varying NOT NULL, "author" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "published_at" TIMESTAMP, "job_title" character varying NOT NULL, "job_role_description" character varying(4095), "annual_salary" double precision NOT NULL, "job_location_id" character varying NOT NULL, "job_classification_id" character varying NOT NULL, "pricing_rule_id" character varying NOT NULL, CONSTRAINT "PK_d3b252c19dd2a27472909c5dfe0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9c46efca38f0ba1ee636262ae" ON "recruitment_brief" ("author") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10cee0b7edb3c9e075377fba52" ON "recruitment_brief" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14f8ceed0c410d27856d9de364" ON "recruitment_brief" ("published_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a14497fb1823b5984a2ac43ef" ON "recruitment_brief" ("job_title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c62d7c8165ded43f999a5b0f21" ON "recruitment_brief" ("job_role_description") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96daf1299455b10d8413c31850" ON "recruitment_brief" ("annual_salary") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d10e519b72915e514a062092e" ON "recruitment_brief" ("job_location_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1bca57bdb2e003323d58d8be9f" ON "recruitment_brief" ("job_classification_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87f3c5473b05c99df29e24134b" ON "recruitment_brief" ("pricing_rule_id") `,
    );
    // Add foreign key for pricing_rule_id, job_location_id, and job_classification_id
    await queryRunner.query(
      `ALTER TABLE "recruitment_brief" ADD CONSTRAINT "FK_recruitmentbrief_pricingrule" FOREIGN KEY ("pricing_rule_id") REFERENCES "pricing_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruitment_brief" ADD CONSTRAINT "FK_recruitmentbrief_joblocation" FOREIGN KEY ("job_location_id") REFERENCES "job_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruitment_brief" ADD CONSTRAINT "FK_recruitmentbrief_jobclassification" FOREIGN KEY ("job_classification_id") REFERENCES "job_classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for pricing_rule_id, job_location_id, and job_classification_id
    await queryRunner.query(
      `ALTER TABLE "recruitment_brief" DROP CONSTRAINT "FK_recruitmentbrief_pricingrule"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruitment_brief" DROP CONSTRAINT "FK_recruitmentbrief_joblocation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruitment_brief" DROP CONSTRAINT "FK_recruitmentbrief_jobclassification"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87f3c5473b05c99df29e24134b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1bca57bdb2e003323d58d8be9f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d10e519b72915e514a062092e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96daf1299455b10d8413c31850"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c62d7c8165ded43f999a5b0f21"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a14497fb1823b5984a2ac43ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_14f8ceed0c410d27856d9de364"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10cee0b7edb3c9e075377fba52"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f9c46efca38f0ba1ee636262ae"`,
    );
    await queryRunner.query(`DROP TABLE "recruitment_brief"`);
  }
}
