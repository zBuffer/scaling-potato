import { Controller, Get, Param } from '@nestjs/common';
import { AgencyFeeQuotationsService } from './agency-fee-quotations.service';
import { throwNotFoundIfFalsey, throwBadRequestIfFalsey } from '../helpers';
import { PricingRulesService } from '../pricing-rules/pricing-rules.service';
import { RecruitmentBriefsService } from '../recruitment-briefs/recruitment-briefs.service';
import {
  AllowedRoles,
  AppRoles,
  User,
} from '../authentication/authentication.decorator';

const PATH_BRIEFID = 'recruitment_brief_id';

@AllowedRoles(AppRoles.RECRUITER)
@Controller(`recruitment-briefs/:${PATH_BRIEFID}/agency-fee-quotation`)
export class AgencyFeeQuotationsController {
  constructor(
    private readonly agencyFeeQuotationsService: AgencyFeeQuotationsService,
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
      await this.agencyFeeQuotationsService.findLatest(recruitmentBrief);
    if (existing) return existing;

    // Find the latest pricing rule
    const latestPricingRule = await throwBadRequestIfFalsey(
      this.pricingRulesService.findLatest(
        recruitmentBrief.job_classification_id,
        recruitmentBrief.job_location_id,
      ),
    );

    return this.agencyFeeQuotationsService.createFor(
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
      this.agencyFeeQuotationsService.findOne(id, recruitmentBrief),
    );
  }
}
