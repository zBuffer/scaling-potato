import { Test, TestingModule } from '@nestjs/testing';
import { PricingRulesService } from './pricing-rules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PricingRule } from './entities/pricing-rule.entity';
import { RecruitmentFeeQuotationsService } from '../recruitment-fee-quotations/recruitment-fee-quotations.service';
import {
  ImportFixture,
  TestRecruitmentBriefs_ForService,
  createTestFixture,
} from '../test-utils/fixture';
import { AgencyFeeQuotationsService } from '../agency-fee-quotations/agency-fee-quotations.service';
import { Repository } from 'typeorm';
import { RecruitmentBrief } from '../recruitment-briefs/entities/recruitment-brief.entity';

describe('PricingRulesService', () => {
  let module: TestingModule;

  let service: PricingRulesService;
  let recruitmentFeeQuotationService: RecruitmentFeeQuotationsService;
  let agencyFeeQuotationService: AgencyFeeQuotationsService;

  let pricingRuleRepository: Repository<PricingRule>;
  let recruitmentBrief: RecruitmentBrief;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: ImportFixture,
      providers: [PricingRulesService],
    }).compile();

    const services = await createTestFixture(module);
    service = services.pricingRulesService;
    recruitmentFeeQuotationService = services.recruitmentFeeQuotationService;
    agencyFeeQuotationService = services.agencyFeeQuotationService;
    recruitmentBrief = services.recruitmentBrief;

    pricingRuleRepository = module.get(getRepositoryToken(PricingRule));
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should increment version when creating pricing rule with same job classification and job location', async () => {
      const result = await service.create({
        job_classification_id: 'engineering',
        job_location_id: 'sydney',
        rate_recruitment_fee: 0.155,
        rate_agency_fee: 0.122,
      });
      expect(result.version).toBe(2);
    });

    it('should invalidate existing pricing rules when creating pricing rule with same job classification and job location', async () => {
      await service.create({
        job_classification_id: 'engineering',
        job_location_id: 'sydney',
        rate_recruitment_fee: 0.155,
        rate_agency_fee: 0.122,
      });
      const result = await service.findAll({
        limit: 10,
        page: 1,
        path: '/pricing-rules',
        filter: { job_classification_id: 'engineering' },
      });
      expect(
        result.data.filter((pr) => pr.invalidated_at !== null).length,
      ).toBe(1);
    });

    it('should invalidate recruitment fee quotations when creating pricing rule with same job classification and job location', async () => {
      const pricingRule1 = await service.findOne(
        recruitmentBrief.pricing_rule_id,
      );
      const recruitmentFeeQuotation1 =
        await recruitmentFeeQuotationService.createFor(
          recruitmentBrief,
          pricingRule1,
        );

      // Create new pricing rule
      const pricingRule2 = await service.create({
        ...pricingRule1,
        rate_recruitment_fee: 0.155,
        rate_agency_fee: 0.122,
      });
      expect(pricingRule2.version).toBe(2);

      const prevRecruitmentFeeQuotation =
        await recruitmentFeeQuotationService.findOne(
          recruitmentFeeQuotation1.id,
        );
      expect(prevRecruitmentFeeQuotation.invalidated_at).not.toBeNull();
    });

    it('should invalidate agency fee quotations when creating pricing rule with same job classification and job location', async () => {
      const pricingRule1 = await service.findOne(
        recruitmentBrief.pricing_rule_id,
      );
      const agencyFeeQuotation1 = await agencyFeeQuotationService.createFor(
        recruitmentBrief,
        pricingRule1,
      );

      // Create new pricing rule
      const pricingRule2 = await service.create({
        ...pricingRule1,
        rate_recruitment_fee: 0.155,
        rate_agency_fee: 0.122,
      });
      expect(pricingRule2.version).toBe(2);

      const prevAgencyFeeQuotation = await agencyFeeQuotationService.findOne(
        agencyFeeQuotation1.id,
      );
      expect(prevAgencyFeeQuotation.invalidated_at).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should filter results by job classification', async () => {
      const result = await service.findAll({
        limit: 10,
        page: 1,
        path: '/pricing-rules',
        filter: { job_classification_id: 'engineering' },
      });
      expect(result.data.length).toBe(2);
    });
  });

  describe('findLatest', () => {
    it('should return the latest pricing rule if found', async () => {
      const pricingRule1 = await service.findLatest(
        TestRecruitmentBriefs_ForService[0].job_classification_id,
        TestRecruitmentBriefs_ForService[0].job_location_id,
      );
      expect(pricingRule1.version).toBe(1);

      await service.create({
        ...pricingRule1,
        rate_recruitment_fee: 0.155,
        rate_agency_fee: 0.122,
      });

      const pricingRule2 = await service.findLatest(
        TestRecruitmentBriefs_ForService[0].job_classification_id,
        TestRecruitmentBriefs_ForService[0].job_location_id,
      );
      expect(pricingRule2.version).toBe(2);
    });

    it('should return null if the latest pricing rule is invalidated', async () => {
      const pricingRule = await service.findLatest(
        TestRecruitmentBriefs_ForService[0].job_classification_id,
        TestRecruitmentBriefs_ForService[0].job_location_id,
      );
      await pricingRuleRepository.update(
        { id: pricingRule.id },
        { invalidated_at: new Date() },
      );

      const result = await service.findLatest(
        TestRecruitmentBriefs_ForService[0].job_classification_id,
        TestRecruitmentBriefs_ForService[0].job_location_id,
      );
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should invalidate quotations when invalidating pricing rule', async () => {
      const pricingRule = await service.findOne(
        recruitmentBrief.pricing_rule_id
      );
      const recruitmentFeeQuotation =
        await recruitmentFeeQuotationService.createFor(
          recruitmentBrief,
          pricingRule,
        );

      const agencyFeeQuotation = await agencyFeeQuotationService.createFor(
        recruitmentBrief,
        pricingRule,
      );

      await service.update(pricingRule, {
        invalidated_at: new Date(),
      });

      const updatedPricingRule = await service.findOne(pricingRule.id);
      expect(updatedPricingRule.invalidated_at).not.toBeNull();

      const updatedRecruitmentFeeQuotation =
        await recruitmentFeeQuotationService.findOne(recruitmentFeeQuotation.id);
      expect(updatedRecruitmentFeeQuotation.invalidated_at).not.toBeNull();

      const updatedAgencyFeeQuotation =
        await agencyFeeQuotationService.findOne(agencyFeeQuotation.id);
      expect(updatedAgencyFeeQuotation.invalidated_at).not.toBeNull();
    });
  });
});
