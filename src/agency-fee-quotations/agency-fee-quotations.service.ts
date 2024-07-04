import { Injectable } from '@nestjs/common';
import { AgencyFeeQuotation } from './entities/agency-fee-quotation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { PricingRule } from '../pricing-rules/entities/pricing-rule.entity';
import { RecruitmentBrief } from '../recruitment-briefs/entities/recruitment-brief.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AgencyFeeQuotationsService {
  constructor(
    @InjectRepository(AgencyFeeQuotation)
    private AgencyFeeQuotationRepository: Repository<AgencyFeeQuotation>,
  ) {}

  /**
   * Creates a new agency fee quotation based on the provided recruitment brief and pricing rule.
   * @param recruitmentBrief - The recruitment brief object.
   * @param latestPricingRule - The latest pricing rule object.
   * @returns The created agency fee quotation.
   */
  async createFor(
    recruitmentBrief: RecruitmentBrief,
    latestPricingRule: PricingRule,
  ) {
    // Create new quotation
    const id = randomUUID();
    const created_at = new Date();
    const agency_fee =
      latestPricingRule.rate_agency_fee * recruitmentBrief.annual_salary;
    const result = {
      id,
      created_at,
      invalidated_at: null,
      agency_fee: agency_fee,
      agency_fee_rate: latestPricingRule.rate_agency_fee,
      recruitment_brief_id: recruitmentBrief.id,
      pricing_rule_id: latestPricingRule.id,
    };
    await this.AgencyFeeQuotationRepository.insert(result);

    return result;
  }

  /**
   * Finds the latest agency fee quotation based on the provided recruitment brief.
   *
   * @param recruitmentBrief - The recruitment brief object.
   * @returns The latest agency fee quotation if found and not invalidated, otherwise null.
   */
  async findLatest(recruitmentBrief: RecruitmentBrief) {
    // Find quotation with the recruitmentBrief and associated price rule
    let existing = await this.AgencyFeeQuotationRepository.findOne({
      where: {
        recruitment_brief_id: recruitmentBrief.id,
        pricing_rule_id: recruitmentBrief.pricing_rule_id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return existing && !existing.invalidated_at ? existing : null;
  }

  /**
   * Finds an agency fee quotation by its ID.
   *
   * @param id - The ID of the agency fee quotation.
   * @param recruitmentBrief - Optional recruitment brief associated with the agency fee quotation.
   * @returns A promise that resolves to the agency fee quotation.
   */
  findOne(id: string, recruitmentBrief?: RecruitmentBrief) {
    return this.AgencyFeeQuotationRepository.findOneBy({
      id,
      ...(recruitmentBrief
        ? { recruitment_brief_id: recruitmentBrief.id }
        : {}),
    });
  }

  /**
   * Clears all agency fee quotations.
   */
  async clear() {
    await this.AgencyFeeQuotationRepository.delete({});
  }
}
