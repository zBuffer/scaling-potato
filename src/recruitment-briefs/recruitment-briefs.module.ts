import { Module } from '@nestjs/common';
import { RecruitmentBriefsService } from './recruitment-briefs.service';
import { RecruitmentBriefsController } from './recruitment-briefs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentBrief } from './entities/recruitment-brief.entity';
import { PricingRulesModule } from '../pricing-rules/pricing-rules.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecruitmentBrief]), PricingRulesModule],
  controllers: [RecruitmentBriefsController],
  providers: [RecruitmentBriefsService],
  exports: [RecruitmentBriefsService],
})
export class RecruitmentBriefsModule {}
