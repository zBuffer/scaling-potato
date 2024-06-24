import { Controller, Get, Param } from '@nestjs/common';
import { RecruitmentFeeQuotationsService } from './recruitment-fee-quotations.service';
import { RecruitmentBriefsService } from '../recruitment-briefs/recruitment-briefs.service';
import { throwBadRequestIfFalsey, throwNotFoundIfFalsey } from '../helpers';
import { PricingRulesService } from '../pricing-rules/pricing-rules.service';
import {
  AllowedRoles,
  AppRoles,
  User,
} from '../authentication/authentication.decorator';

const PATH_BRIEFID = 'recruitment_brief_id';

@AllowedRoles(AppRoles.HIRER)
@Controller(`recruitment-briefs/:${PATH_BRIEFID}/recruitment-fee-quotation`)
export class RecruitmentFeeQuotationsController {
  constructor(
    private readonly recruitmentFeeQuotationsService: RecruitmentFeeQuotationsService,
    private readonly pricingRulesService: PricingRulesService,
    private readonly recruitmentBriefsService: RecruitmentBriefsService,
  ) {}

  @Get()
  async findLatest(
    @Param(PATH_BRIEFID) recruitment_brief_id: string,
    @User() user: any,
  ) {
    const recruitmentBrief = await throwNotFoundIfFalsey(
      this.recruitmentBriefsService.findOnePublishedOrByAuthor(
        recruitment_brief_id,
        user?.sub,
      ),
    );

    // Find the latest quotation
    const existing =
      await this.recruitmentFeeQuotationsService.findLatest(recruitmentBrief);
    if (existing) return existing;

    // Find the latest pricing rule
    const latestPricingRule = await throwBadRequestIfFalsey(
      this.pricingRulesService.findLatest(
        recruitmentBrief.job_classification_id,
        recruitmentBrief.job_location_id,
      ),
    );

    return this.recruitmentFeeQuotationsService.createFor(
      recruitmentBrief,
      latestPricingRule,
    );
  }

  @Get(':id')
  async findOne(
    @Param(PATH_BRIEFID) recruitment_brief_id: string,
    @Param('id') id: string,
    @User() user: any,
  ) {
    const recruitmentBrief = await throwNotFoundIfFalsey(
      this.recruitmentBriefsService.findOnePublishedOrByAuthor(
        recruitment_brief_id,
        user?.sub,
      ),
    );

    return throwNotFoundIfFalsey(
      this.recruitmentFeeQuotationsService.findOne(id, recruitmentBrief),
    );
  }
}
