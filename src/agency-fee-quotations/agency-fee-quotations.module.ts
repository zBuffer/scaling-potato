import { Module } from '@nestjs/common';
import { AgencyFeeQuotationsService } from './agency-fee-quotations.service';
import { AgencyFeeQuotationsController } from './agency-fee-quotations.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyFeeQuotation } from './entities/agency-fee-quotation.entity';
import { PricingRulesModule } from '../pricing-rules/pricing-rules.module';
import { RecruitmentBriefsModule } from '../recruitment-briefs/recruitment-briefs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgencyFeeQuotation]),
    PricingRulesModule,
    RecruitmentBriefsModule,
  ],
  controllers: [AgencyFeeQuotationsController],
  providers: [AgencyFeeQuotationsService],
})
export class AgencyFeeQuotationsModule {}
