import { Inject, Injectable } from '@nestjs/common';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { PricingRule } from './entities/pricing-rule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, LessThan, Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { randomUUID } from 'crypto';
import { RecruitmentFeeQuotation } from '../recruitment-fee-quotations/entities/recruitment-fee-quotation.entity';
import { AgencyFeeQuotation } from '../agency-fee-quotations/entities/agency-fee-quotation.entity';
import { UpdatePricingRuleDto } from './dto/update-pricing-rule.dto';

@Injectable()
export class PricingRulesService {
  constructor(
    @InjectRepository(PricingRule)
    private readonly pricingRuleRepository: Repository<PricingRule>,
    @InjectRepository(RecruitmentFeeQuotation)
    private readonly recruitmentFeeQuotationRepository: Repository<RecruitmentFeeQuotation>,
    @InjectRepository(AgencyFeeQuotation)
    private readonly agencyFeeQuotationRepository: Repository<AgencyFeeQuotation>,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Creates a new pricing rule based on the provided data.
   * If an existing pricing rule is found, it increments the version, invalidates older versions,
   * and also invalidates any associated quotations.
   *
   * @param createPricingRuleDto - The data for creating the pricing rule.
   * @returns The newly created pricing rule.
   */
  async create(createPricingRuleDto: CreatePricingRuleDto) {
    return await this.dataSource.transaction(async () => {
      // Find existing pricing rule
      const existingPricingRule = await this.pricingRuleRepository.findOne({
        where: {
          job_classification_id: createPricingRuleDto.job_classification_id,
          job_location_id: createPricingRuleDto.job_location_id,
        },
        order: { version: 'DESC' },
      });

      // Increment version if existing pricing rule found
      const version = existingPricingRule?.version
        ? existingPricingRule.version + 1
        : 1;
      const id = randomUUID();
      const created_at = new Date();
      const invalidated_at = created_at;
      const result = {
        ...createPricingRuleDto,
        id,
        created_at,
        version,
      };
      await this.pricingRuleRepository.insert(result);

      // Invalidate existing pricing rules
      await this.invalidateOlderVersions(invalidated_at, result);
      if (existingPricingRule) {
        await this.invalidateQuotations(invalidated_at, existingPricingRule);
      }

      return result;
    });
  }

  /**
   * Retrieves all pricing rules based on the provided query parameters.
   *
   * @param query - The query parameters for pagination, sorting, filtering, and searching.
   * @returns A promise that resolves to a paginated list of pricing rules.
   */
  findAll(query: PaginateQuery): Promise<Paginated<PricingRule>> {
    return paginate(query, this.pricingRuleRepository, {
      sortableColumns: [
        'id',
        'author',
        'created_at',
        'invalidated_at',
        'job_classification_id',
        'job_location_id',
        'rate_agency_fee',
        'rate_recruitment_fee',
        'version',
      ],
      searchableColumns: ['author', 'job_classification_id', 'job_location_id'],
      filterableColumns: {
        id: true,
        author: true,
        created_at: true,
        invalidated_at: true,
        job_classification_id: true,
        job_location_id: true,
        rate_agency_fee: true,
        rate_recruitment_fee: true,
        version: true,
      },
      defaultSortBy: [['created_at', 'DESC']],
    });
  }

  /**
   * Retrieves a pricing rule by its ID.
   * @param id - The ID of the pricing rule to retrieve.
   * @returns A Promise that resolves to the found pricing rule, or null if not found.
   */
  findOne(id: string): Promise<PricingRule | null> {
    return this.pricingRuleRepository.findOneBy({ id });
  }

  /**
   * Finds the latest pricing rule based on the given job classification ID and job location ID.
   *
   * @param job_classification_id - The ID of the job classification.
   * @param job_location_id - The ID of the job location.
   * @returns A promise that resolves to the latest PricingRule object, or null if not found.
   */
  findLatest(
    job_classification_id: string,
    job_location_id: string,
  ): Promise<PricingRule | null> {
    return this.pricingRuleRepository.findOne({
      where: {
        job_classification_id,
        job_location_id,
        invalidated_at: IsNull(),
      },
      order: { version: 'DESC' },
    });
  }

  /**
   * Updates a pricing rule with the specified ID.
   *
   * @param id - The ID of the pricing rule to update.
   * @param updatePricingRuleDto - The data to update the pricing rule with.
   */
  async update(pricingRule: PricingRule, updatePricingRuleDto: UpdatePricingRuleDto) {
    await this.dataSource.transaction(async () => {
      await this.pricingRuleRepository.update({ id: pricingRule.id }, updatePricingRuleDto);
      if (updatePricingRuleDto.invalidated_at) {
        await this.invalidateQuotations(updatePricingRuleDto.invalidated_at, pricingRule);
      }
    });
  }

  /**
   * Checks if a pricing rule with the given ID exists.
   * 
   * @param id - The ID of the pricing rule to check.
   * @returns A boolean indicating whether the pricing rule exists.
   */
  exists(id: string) {
    return this.pricingRuleRepository.existsBy({ id });
  }

  /**
   * Clears all pricing rules.
   */
  async clear() {
    await this.pricingRuleRepository.clear();
  }

  /**
   * Invalidates quotations for a given pricing rule.
   *
   * @param invalidatedAt - The date at which the quotations are invalidated.
   * @param pricingRule - The pricing rule for which the quotations are invalidated.
   */
  private async invalidateQuotations(
    invalidatedAt: Date,
    pricingRule: PricingRule,
  ) {
    await this.recruitmentFeeQuotationRepository.update(
      {
        pricing_rule_id: pricingRule.id,
        invalidated_at: IsNull(),
      },
      {
        invalidated_at: invalidatedAt,
      },
    );
    await this.agencyFeeQuotationRepository.update(
      {
        pricing_rule_id: pricingRule.id,
        invalidated_at: IsNull(),
      },
      {
        invalidated_at: invalidatedAt,
      },
    );
  }

  /**
   * Invalidates older versions of pricing rules based on the given `pricingRule`.
   * @param invalidatedAt The date at which the pricing rule should be invalidated.
   * @param pricingRule The pricing rule to compare against for invalidation.
   */
  private async invalidateOlderVersions(
    invalidatedAt: Date,
    pricingRule: PricingRule,
  ) {
    await this.pricingRuleRepository.update(
      {
        version: LessThan(pricingRule.version),
        job_classification_id: pricingRule.job_classification_id,
        job_location_id: pricingRule.job_location_id,
        invalidated_at: IsNull(),
      },
      {
        invalidated_at: invalidatedAt,
      },
    );
  }
}
