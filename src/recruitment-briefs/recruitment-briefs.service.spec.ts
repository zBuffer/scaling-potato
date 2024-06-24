import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentBriefsService } from './recruitment-briefs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ImportFixture,
  TestRecruitmentBriefs_ForService,
  createTestFixture,
  findTestPricingRule,
} from '../test-utils/fixture';
import { Repository } from 'typeorm';
import { PricingRule } from '../pricing-rules/entities/pricing-rule.entity';

describe('RecruitmentBriefsService', () => {
  let module: TestingModule;
  let service: RecruitmentBriefsService;

  let pricingRuleRepository: Repository<PricingRule>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: ImportFixture,
      providers: [RecruitmentBriefsService],
    }).compile();

    const services = await createTestFixture(module);
    service = services.recruitmentBriefService;

    pricingRuleRepository = module.get(getRepositoryToken(PricingRule));
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new recruitment brief', async () => {
      const pricingRule = await findTestPricingRule(1, pricingRuleRepository);
      const result = await service.create(
        TestRecruitmentBriefs_ForService[1],
        pricingRule,
      );

      const expectedBrief = {
        ...TestRecruitmentBriefs_ForService[1],
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        published_at: TestRecruitmentBriefs_ForService[1].published_at
          ? new Date(TestRecruitmentBriefs_ForService[1].published_at)
          : null,
        invalidated_at: undefined,
        pricing_rule_id: pricingRule.id,
      };

      expect(result).toEqual(expectedBrief);
    });
  });

  describe('findAllPublishedOrByAuthor', () => {
    it('should return paginated recruitment briefs by same author or published', async () => {
      const recruitmentBriefs = await createAllRecruitmentBriefs();

      for (const author of ['hirer', 'hirer2']) {
        const expected = recruitmentBriefs
          .filter((brief) => brief.author === author || brief.published_at)
          // sort by created_at descending, then published_at descending, unpublished first
          .sort((a, b) => {
            if (a.created_at > b.created_at) return -1;
            if (a.created_at < b.created_at) return 1;
            if (!a.published_at && b.published_at) return -1;
            if (a.published_at && !b.published_at) return 1;
            if (a.published_at && b.published_at) {
              if (a.published_at > b.published_at) return -1;
              if (a.published_at < b.published_at) return 1;
            }
            return 0;
          })
          .slice(0, 10);
        const result = await service.findAllPublishedOrByAuthor(
          { limit: 10, page: 1, path: '/recruitment-briefs' },
          author,
        );
        expect(result.data).toEqual(expected);
      }
    });
  });

  describe('findOnePublishedOrByAuthor', () => {
    it('should return a recruitment brief by ID if it is published and authored by the same author', async () => {
      const index = TestRecruitmentBriefs_ForService.findIndex(
        (brief) => brief.author === 'hirer' && brief.published_at,
      );
      const pricingRule = await findTestPricingRule(
        index,
        pricingRuleRepository,
      );
      const recruitmentBrief = await service.create(
        TestRecruitmentBriefs_ForService[index],
        pricingRule,
      );
      const result = await service.findOnePublishedOrByAuthor(
        recruitmentBrief.id,
        'hirer',
      );
      expect(result).toEqual(recruitmentBrief);
    });
    it('should return a recruitment brief by ID if it is unpublished and authored by the same author', async () => {
      const index = TestRecruitmentBriefs_ForService.findIndex(
        (brief) => brief.author === 'hirer' && !brief.published_at,
      );
      const pricingRule = await findTestPricingRule(
        index,
        pricingRuleRepository,
      );
      const recruitmentBrief = await service.create(
        TestRecruitmentBriefs_ForService[index],
        pricingRule,
      );
      const result = await service.findOnePublishedOrByAuthor(
        recruitmentBrief.id,
        'hirer',
      );
      expect(result).toEqual(recruitmentBrief);
    });
    it('should return null if it is unpublished and authored by a different author', async () => {
      const index = TestRecruitmentBriefs_ForService.findIndex(
        (brief) => brief.author === 'hirer2' && !brief.published_at,
      );
      const pricingRule = await findTestPricingRule(
        index,
        pricingRuleRepository,
      );
      const recruitmentBrief = await service.create(
        TestRecruitmentBriefs_ForService[index],
        pricingRule,
      );
      const result = await service.findOnePublishedOrByAuthor(
        recruitmentBrief.id,
        'hirer',
      );
      expect(result).toBeNull();
    });
    it('should return a recruitment brief by ID if it is published by a different author', async () => {
      const index = TestRecruitmentBriefs_ForService.findIndex(
        (brief) => brief.author === 'hirer2' && brief.published_at,
      );
      const pricingRule = await findTestPricingRule(
        index,
        pricingRuleRepository,
      );
      const recruitmentBrief = await service.create(
        TestRecruitmentBriefs_ForService[index],
        pricingRule,
      );
      const result = await service.findOnePublishedOrByAuthor(
        recruitmentBrief.id,
        'hirer',
      );
      expect(result).toEqual(recruitmentBrief);
    });
  });

  /**
   * Creates all recruitment briefs and performs sanity checks on the results.
   * Use this as early as possible in the test suite to ensure the test data is set up correctly.
   * @returns A Promise that resolves to an array of created recruitment briefs.
   */
  async function createAllRecruitmentBriefs() {
    await Promise.all(
      TestRecruitmentBriefs_ForService.slice(1).map(
        async (recruitmentBrief, index) => {
          const pricingRule = await findTestPricingRule(
            index,
            pricingRuleRepository,
          );
          return await service.create(recruitmentBrief, pricingRule);
        },
      ),
    );

    const results = (
      await service.findAll({
        limit: 100,
        page: 1,
        path: '/recruitment-briefs',
      })
    ).data;

    // Sanity checks to make sure we have the correct test data set up
    const hirer1Briefs = results.filter((brief) => brief.author === 'hirer');
    const hirer2Briefs = results.filter((brief) => brief.author === 'hirer2');
    const unpublishedHirer1Briefs = hirer1Briefs.filter(
      (brief) => !brief.published_at,
    );
    const unpublishedHirer2Briefs = hirer2Briefs.filter(
      (brief) => !brief.published_at,
    );

    expect(hirer1Briefs.length).toBeGreaterThan(0);
    expect(hirer2Briefs.length).toBeGreaterThan(0);
    expect(unpublishedHirer1Briefs.length).toBeGreaterThan(0);
    expect(unpublishedHirer2Briefs.length).toBeGreaterThan(0);
    expect(unpublishedHirer1Briefs.length).toBeLessThan(hirer1Briefs.length);
    expect(unpublishedHirer2Briefs.length).toBeLessThan(hirer2Briefs.length);

    return results;
  }
});
