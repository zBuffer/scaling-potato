import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719129943245 implements MigrationInterface {
  name = 'Migration1719129943245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pricing_rule" ("id" character varying NOT NULL, "author" character varying(255), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, "invalidated_at" TIMESTAMP, "rate_recruitment_fee" double precision NOT NULL, "rate_agency_fee" double precision NOT NULL, "job_location_id" character varying NOT NULL, "job_classification_id" character varying NOT NULL, CONSTRAINT "UQ_7845e60dd3826130d67be1ce9f3" UNIQUE ("job_location_id", "job_classification_id", "version"), CONSTRAINT "PK_70bd05029b296e414ce19688a99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ecd35403d2e52948497c8cae8" ON "pricing_rule" ("version") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f679957e9ad3e598e6f5e552a" ON "pricing_rule" ("job_location_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_abd6ce3f3a49c82e3895dd525b" ON "pricing_rule" ("job_classification_id") `,
    );
    // Create foreign keys for job_location_id and job_classification_id
    await queryRunner.query(
      `ALTER TABLE "pricing_rule" ADD CONSTRAINT "FK_pricingrule_joblocation" FOREIGN KEY ("job_location_id") REFERENCES "job_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_rule" ADD CONSTRAINT "FK_pricingrule_jobclassification" FOREIGN KEY ("job_classification_id") REFERENCES "job_classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for job_location_id and job_classification_id
    await queryRunner.query(
      `ALTER TABLE "pricing_rule" DROP CONSTRAINT "FK_pricingrule_joblocation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_rule" DROP CONSTRAINT "FK_pricingrule_jobclassification"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_abd6ce3f3a49c82e3895dd525b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f679957e9ad3e598e6f5e552a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ecd35403d2e52948497c8cae8"`,
    );
    await queryRunner.query(`DROP TABLE "pricing_rule"`);
  }
}
