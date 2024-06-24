import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentFeeQuotationsService } from './recruitment-fee-quotations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecruitmentFeeQuotation } from './entities/recruitment-fee-quotation.entity';
import {
  ImportFixture,
  createTestFixture,
  createTestRecruitmentBrief,
} from '../test-utils/fixture';
import { PricingRule } from '../pricing-rules/entities/pricing-rule.entity';
import { RecruitmentBrief } from '../recruitment-briefs/entities/recruitment-brief.entity';
import { Repository } from 'typeorm';

describe('RecruitmentFeeQuotationsService', () => {
  let module: TestingModule;
  let service: RecruitmentFeeQuotationsService;

  let pricingRuleRepository: Repository<PricingRule>;
  let recruitmentBriefRepository: Repository<RecruitmentBrief>;
  let recruitmentFeeFeeQuotationRepository: Repository<RecruitmentFeeQuotation>;

  let recruitmentBrief: RecruitmentBrief;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: ImportFixture,
      providers: [RecruitmentFeeQuotationsService],
    }).compile();

    const services = await createTestFixture(module);

    service = services.recruitmentFeeQuotationService;
    pricingRuleRepository = module.get(getRepositoryToken(PricingRule));
    recruitmentBriefRepository = module.get(
      getRepositoryToken(RecruitmentBrief),
    );
    recruitmentFeeFeeQuotationRepository = module.get(
      getRepositoryToken(RecruitmentFeeQuotation),
    );
    recruitmentBrief = services.recruitmentBrief;
  });

  afterEach(async () => {
    await module.close();
  });

  describe('createFor', () => {
    it('should create a new quotation with correct values', async () => {
      const pricingRule = await pricingRuleRepository.findOneBy({
        id: recruitmentBrief.pricing_rule_id,
      });

      const expectedQuotation = {
        id: expect.any(String),
        created_at: expect.any(Date),
        invalidated_at: null,
        recruitment_fee:
          recruitmentBrief.annual_salary * pricingRule.rate_recruitment_fee,
        recruitment_fee_rate: pricingRule.rate_recruitment_fee,
        recruitment_brief_id: recruitmentBrief.id,
        pricing_rule_id: pricingRule.id,
      };

      const result = await service.createFor(recruitmentBrief, pricingRule);
      expect(result).toEqual(expectedQuotation);
    });
  });

  describe('findLatest', () => {
    it('should return the latest recruitment fee quotation if found and not invalidated', async () => {
      const { pricingRule } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );

      const expectedQuotation = {
        id: expect.any(String),
        created_at: expect.any(Date),
        invalidated_at: null,
        recruitment_fee:
          recruitmentBrief.annual_salary * pricingRule.rate_recruitment_fee,
        recruitment_fee_rate: pricingRule.rate_recruitment_fee,
        recruitment_brief_id: recruitmentBrief.id,
        pricing_rule_id: pricingRule.id,
      };

      const result = await service.findLatest(recruitmentBrief);
      expect(result).toEqual(expectedQuotation);
    });

    it('should return null if the latest recruitment fee quotation is invalidated', async () => {
      const { quotation } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );
      await recruitmentFeeFeeQuotationRepository.update(
        { id: quotation.id },
        { invalidated_at: new Date() },
      );

      const result = await service.findLatest(recruitmentBrief);
      expect(result).toBeNull();
    });

    it('should return null if the latest recruitment fee quotation is not found', async () => {
      const result = await service.findLatest(recruitmentBrief);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return the recruitment fee quotation by ID', async () => {
      const { quotation } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );
      const result = await service.findOne(quotation.id, recruitmentBrief);
      expect(result).toEqual(quotation);
    });

    it('should return the recruitment fee quotation by ID belonging to the recruitment brief', async () => {
      const { quotation } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );
      const result = await service.findOne(quotation.id, recruitmentBrief);
      expect(result).toEqual(quotation);
    });

    it('should return null if ID is belonging to another recruitment brief', async () => {
      const { recruitmentBrief: recruitmentBrief2 } =
        await createTestRecruitmentBrief(
          1,
          pricingRuleRepository,
          recruitmentBriefRepository,
        );
      const { quotation } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );
      const result = await service.findOne(quotation.id, recruitmentBrief2);
      expect(result).toBeNull();
    });
  });

  async function createNewQuotation(
    pricingRuleRepository: Repository<PricingRule>,
    service: RecruitmentFeeQuotationsService,
  ) {
    const pricingRule = await pricingRuleRepository.findOneBy({
      id: recruitmentBrief.pricing_rule_id,
    });
    const quotation = await service.createFor(recruitmentBrief, pricingRule);
    return { quotation, pricingRule };
  }
});
