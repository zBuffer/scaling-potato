import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720067566552 implements MigrationInterface {
    name = 'Migration1720067566552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agency_fee_quotation" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "invalidated_at" TIMESTAMP, "agency_fee" double precision NOT NULL, "agency_fee_rate" double precision NOT NULL, "recruitment_brief_id" character varying NOT NULL, "pricing_rule_id" character varying NOT NULL, CONSTRAINT "UQ_488448f1163588a601a86a579e7" UNIQUE ("recruitment_brief_id", "pricing_rule_id"), CONSTRAINT "PK_e21813ddb5d3ffaba778bc4c43c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c1610857c83edf35163325e724" ON "agency_fee_quotation" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_6d4a3f86318110ce429ba15d94" ON "agency_fee_quotation" ("invalidated_at") `);
        // Add foreign key for recruitment_brief_id and pricing_rule_id
        await queryRunner.query(
            `ALTER TABLE "agency_fee_quotation" ADD CONSTRAINT "FK_agencyfeequotation_recruitmentbrief" FOREIGN KEY ("recruitment_brief_id") REFERENCES "recruitment_brief"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "agency_fee_quotation" ADD CONSTRAINT "FK_agencyfeequotation_pricingrule" FOREIGN KEY ("pricing_rule_id") REFERENCES "pricing_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys for recruitment_brief_id and pricing_rule_id
        await queryRunner.query(
            `ALTER TABLE "agency_fee_quotation" DROP CONSTRAINT "FK_agencyfeequotation_pricingrule"`,
        );
        await queryRunner.query(
            `ALTER TABLE "agency_fee_quotation" DROP CONSTRAINT "FK_agencyfeequotation_recruitmentbrief"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_6d4a3f86318110ce429ba15d94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1610857c83edf35163325e724"`);
        await queryRunner.query(`DROP TABLE "agency_fee_quotation"`);
    }

}
