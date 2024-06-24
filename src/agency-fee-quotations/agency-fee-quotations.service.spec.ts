import { Test, TestingModule } from '@nestjs/testing';
import { AgencyFeeQuotationsService } from './agency-fee-quotations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AgencyFeeQuotation } from './entities/agency-fee-quotation.entity';
import { RecruitmentBrief } from '../recruitment-briefs/entities/recruitment-brief.entity';
import {
  ImportFixture,
  createTestFixture,
  createTestRecruitmentBrief,
} from '../test-utils/fixture';
import { PricingRule } from '../pricing-rules/entities/pricing-rule.entity';
import { Repository } from 'typeorm';

describe('AgencyFeeQuotationsService', () => {
  let module: TestingModule;
  let service: AgencyFeeQuotationsService;

  let pricingRuleRepository: Repository<PricingRule>;
  let recruitmentBriefRepository: Repository<RecruitmentBrief>;
  let agencyFeeQuotationRepository: Repository<AgencyFeeQuotation>;

  let recruitmentBrief: RecruitmentBrief;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: ImportFixture,
      providers: [AgencyFeeQuotationsService],
    }).compile();

    const services = await createTestFixture(module);

    service = services.agencyFeeQuotationService;
    pricingRuleRepository = module.get(getRepositoryToken(PricingRule));
    recruitmentBriefRepository = module.get(
      getRepositoryToken(RecruitmentBrief),
    );
    agencyFeeQuotationRepository = module.get(
      getRepositoryToken(AgencyFeeQuotation),
    );
    recruitmentBrief = services.recruitmentBrief;
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        agency_fee:
          recruitmentBrief.annual_salary * pricingRule.rate_agency_fee,
        agency_fee_rate: pricingRule.rate_agency_fee,
        recruitment_brief_id: recruitmentBrief.id,
        pricing_rule_id: pricingRule.id,
      };

      const result = await service.createFor(recruitmentBrief, pricingRule);
      expect(result).toEqual(expectedQuotation);
    });
  });

  describe('findLatest', () => {
    it('should return the latest agency fee quotation if found and not invalidated', async () => {
      const { pricingRule } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );

      const expectedQuotation = {
        id: expect.any(String),
        created_at: expect.any(Date),
        invalidated_at: null,
        agency_fee:
          recruitmentBrief.annual_salary * pricingRule.rate_agency_fee,
        agency_fee_rate: pricingRule.rate_agency_fee,
        recruitment_brief_id: recruitmentBrief.id,
        pricing_rule_id: pricingRule.id,
      };

      const result = await service.findLatest(recruitmentBrief);
      expect(result).toEqual(expectedQuotation);
    });

    it('should return null if the latest agency fee quotation is invalidated', async () => {
      const { quotation } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );
      await agencyFeeQuotationRepository.update(
        { id: quotation.id },
        { invalidated_at: new Date() },
      );

      const result = await service.findLatest(recruitmentBrief);
      expect(result).toBeNull();
    });

    it('should return null if the latest agency fee quotation is not found', async () => {
      const result = await service.findLatest(recruitmentBrief);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return the agency fee quotation by ID', async () => {
      const { quotation } = await createNewQuotation(
        pricingRuleRepository,
        service,
      );
      const result = await service.findOne(quotation.id, recruitmentBrief);
      expect(result).toEqual(quotation);
    });

    it('should return the agency fee quotation by ID belonging to the recruitment brief', async () => {
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
    service: AgencyFeeQuotationsService,
  ) {
    const pricingRule = await pricingRuleRepository.findOneBy({
      id: recruitmentBrief.pricing_rule_id,
    });
    const quotation = await service.createFor(recruitmentBrief, pricingRule);
    return { quotation, pricingRule };
  }
});
