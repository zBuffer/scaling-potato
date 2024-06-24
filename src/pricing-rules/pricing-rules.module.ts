import { Module } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import { PricingRulesController } from './pricing-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingRule } from './entities/pricing-rule.entity';
import { RecruitmentFeeQuotation } from '../recruitment-fee-quotations/entities/recruitment-fee-quotation.entity';
import { AgencyFeeQuotation } from '../agency-fee-quotations/entities/agency-fee-quotation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PricingRule,
      RecruitmentFeeQuotation,
      AgencyFeeQuotation,
    ]),
  ],
  controllers: [PricingRulesController],
  providers: [PricingRulesService],
  exports: [PricingRulesService],
})
export class PricingRulesModule {}
