import { Module } from '@nestjs/common';
import { RecruitmentFeeQuotationsService } from './recruitment-fee-quotations.service';
import { RecruitmentFeeQuotationsController } from './recruitment-fee-quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentFeeQuotation } from './entities/recruitment-fee-quotation.entity';
import { PricingRulesModule } from '../pricing-rules/pricing-rules.module';
import { RecruitmentBriefsModule } from '../recruitment-briefs/recruitment-briefs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecruitmentFeeQuotation]),
    PricingRulesModule,
    RecruitmentBriefsModule,
  ],
  controllers: [RecruitmentFeeQuotationsController],
  providers: [RecruitmentFeeQuotationsService],
})
export class RecruitmentFeeQuotationsModule {}
