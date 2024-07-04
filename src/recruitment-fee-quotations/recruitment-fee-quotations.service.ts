import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RecruitmentFeeQuotation } from './entities/recruitment-fee-quotation.entity';
import { RecruitmentBrief } from '../recruitment-briefs/entities/recruitment-brief.entity';
import { randomUUID } from 'crypto';
import { PricingRule } from '../pricing-rules/entities/pricing-rule.entity';

@Injectable()
export class RecruitmentFeeQuotationsService {
  constructor(
    @InjectRepository(RecruitmentFeeQuotation)
    private readonly RecruitmentFeeQuotationRepository: Repository<RecruitmentFeeQuotation>,
  ) {}

  /**
   * Creates a new recruitment fee quotation.
   * @param recruitmentBrief - The recruitment brief object.
   * @param latestPricingRule - The latest pricing rule object.
   * @returns The created recruitment fee quotation.
   */
  async createFor(
    recruitmentBrief: RecruitmentBrief,
    latestPricingRule: PricingRule,
  ) {
    // Create new quotation
    const id = randomUUID();
    const created_at = new Date();
    const recruitment_fee =
      latestPricingRule.rate_recruitment_fee * recruitmentBrief.annual_salary;
    const result = {
      id,
      created_at,
      invalidated_at: null,
      recruitment_fee,
      recruitment_fee_rate: latestPricingRule.rate_recruitment_fee,
      recruitment_brief_id: recruitmentBrief.id,
      pricing_rule_id: latestPricingRule.id,
    };
    await this.RecruitmentFeeQuotationRepository.insert(result);

    return result;
  }

  /**
   * Finds the latest recruitment fee quotation based on the provided recruitment brief.
   *
   * @param recruitmentBrief - The recruitment brief object.
   * @returns The latest recruitment fee quotation if found and not invalidated, otherwise null.
   */
  async findLatest(recruitmentBrief: RecruitmentBrief) {
    // Find quotation with the recruitmentBrief and associated price rule
    let existing = await this.RecruitmentFeeQuotationRepository.findOne({
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
   * Finds a recruitment fee quotation by its ID.
   *
   * @param id - The ID of the recruitment fee quotation to find.
   * @param recruitmentBrief - Optional recruitment brief object to filter the search.
   * @returns A promise that resolves to the found recruitment fee quotation, or undefined if not found.
   */
  findOne(id: string, recruitmentBrief?: RecruitmentBrief) {
    return this.RecruitmentFeeQuotationRepository.findOneBy({
      id,
      ...(recruitmentBrief
        ? { recruitment_brief_id: recruitmentBrief.id }
        : {}),
    });
  }

  /**
   * Clears all recruitment fee quotations.
   */
  async clear() {
    await this.RecruitmentFeeQuotationRepository.delete({});
  }
}
