import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720067566552 implements MigrationInterface {
    name = 'Migration1720067566552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruitment_fee_quotation" DROP CONSTRAINT "FK_recruitmentfeequotation_recruitmentbrief"`);
        await queryRunner.query(`ALTER TABLE "recruitment_fee_quotation" DROP CONSTRAINT "FK_recruitmentfeequotation_pricingrule"`);
        await queryRunner.query(`ALTER TABLE "recruitment_brief" DROP CONSTRAINT "FK_recruitmentbrief_pricingrule"`);
        await queryRunner.query(`ALTER TABLE "recruitment_brief" DROP CONSTRAINT "FK_recruitmentbrief_joblocation"`);
        await queryRunner.query(`ALTER TABLE "recruitment_brief" DROP CONSTRAINT "FK_recruitmentbrief_jobclassification"`);
        await queryRunner.query(`ALTER TABLE "pricing_rule" DROP CONSTRAINT "FK_pricingrule_joblocation"`);
        await queryRunner.query(`ALTER TABLE "pricing_rule" DROP CONSTRAINT "FK_pricingrule_jobclassification"`);
        await queryRunner.query(`CREATE TABLE "agency_fee_quotation" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "invalidated_at" TIMESTAMP, "agency_fee" double precision NOT NULL, "agency_fee_rate" double precision NOT NULL, "recruitment_brief_id" character varying NOT NULL, "pricing_rule_id" character varying NOT NULL, CONSTRAINT "UQ_488448f1163588a601a86a579e7" UNIQUE ("recruitment_brief_id", "pricing_rule_id"), CONSTRAINT "PK_e21813ddb5d3ffaba778bc4c43c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c1610857c83edf35163325e724" ON "agency_fee_quotation" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_6d4a3f86318110ce429ba15d94" ON "agency_fee_quotation" ("invalidated_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6d4a3f86318110ce429ba15d94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1610857c83edf35163325e724"`);
        await queryRunner.query(`DROP TABLE "agency_fee_quotation"`);
        await queryRunner.query(`ALTER TABLE "pricing_rule" ADD CONSTRAINT "FK_pricingrule_jobclassification" FOREIGN KEY ("job_classification_id") REFERENCES "job_classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pricing_rule" ADD CONSTRAINT "FK_pricingrule_joblocation" FOREIGN KEY ("job_location_id") REFERENCES "job_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruitment_brief" ADD CONSTRAINT "FK_recruitmentbrief_jobclassification" FOREIGN KEY ("job_classification_id") REFERENCES "job_classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruitment_brief" ADD CONSTRAINT "FK_recruitmentbrief_joblocation" FOREIGN KEY ("job_location_id") REFERENCES "job_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruitment_brief" ADD CONSTRAINT "FK_recruitmentbrief_pricingrule" FOREIGN KEY ("pricing_rule_id") REFERENCES "pricing_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruitment_fee_quotation" ADD CONSTRAINT "FK_recruitmentfeequotation_pricingrule" FOREIGN KEY ("pricing_rule_id") REFERENCES "pricing_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruitment_fee_quotation" ADD CONSTRAINT "FK_recruitmentfeequotation_recruitmentbrief" FOREIGN KEY ("recruitment_brief_id") REFERENCES "recruitment_brief"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
