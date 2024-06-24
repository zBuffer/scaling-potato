import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719136882097 implements MigrationInterface {
  name = 'Migration1719136882097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recruitment_fee_quotation" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "invalidated_at" TIMESTAMP, "recruitment_fee" double precision NOT NULL, "recruitment_fee_rate" double precision NOT NULL, "recruitment_brief_id" character varying NOT NULL, "pricing_rule_id" character varying NOT NULL, CONSTRAINT "UQ_b68d7a3b7ddcbed68db52da64ac" UNIQUE ("recruitment_brief_id", "pricing_rule_id"), CONSTRAINT "PK_5eb4378c937518af309d33fc006" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_edc89a990bd35d9556023258b0" ON "recruitment_fee_quotation" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_632301982ffdacb083a38d55fb" ON "recruitment_fee_quotation" ("invalidated_at") `,
    );
    // Add foreign key for recruitment_brief_id and pricing_rule_id
    await queryRunner.query(
      `ALTER TABLE "recruitment_fee_quotation" ADD CONSTRAINT "FK_recruitmentfeequotation_recruitmentbrief" FOREIGN KEY ("recruitment_brief_id") REFERENCES "recruitment_brief"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruitment_fee_quotation" ADD CONSTRAINT "FK_recruitmentfeequotation_pricingrule" FOREIGN KEY ("pricing_rule_id") REFERENCES "pricing_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for recruitment_brief_id and pricing_rule_id
    await queryRunner.query(
      `ALTER TABLE "recruitment_fee_quotation" DROP CONSTRAINT "FK_recruitmentfeequotation_pricingrule"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recruitment_fee_quotation" DROP CONSTRAINT "FK_recruitmentfeequotation_recruitmentbrief"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_632301982ffdacb083a38d55fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_edc89a990bd35d9556023258b0"`,
    );
    await queryRunner.query(`DROP TABLE "recruitment_fee_quotation"`);
  }
}
