import { TestingModule } from '@nestjs/testing';
import { JobClassificationsService } from '../job-classifications/job-classifications.service';
import { JobLocationsService } from '../job-locations/job-locations.service';
import { PricingRulesService } from '../pricing-rules/pricing-rules.service';
import { RecruitmentBriefsService } from '../recruitment-briefs/recruitment-briefs.service';
import { RecruitmentFeeQuotationsService } from '../recruitment-fee-quotations/recruitment-fee-quotations.service';
import { AgencyFeeQuotationsService } from '../agency-fee-quotations/agency-fee-quotations.service';
import { RecruitmentBrief } from '../recruitment-briefs/entities/recruitment-brief.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyFeeQuotationsModule } from '../agency-fee-quotations/agency-fee-quotations.module';
import { AgencyFeeQuotation } from '../agency-fee-quotations/entities/agency-fee-quotation.entity';
import { testDataSource } from '../env';
import { JobClassificationsModule } from '../job-classifications/job-classifications.module';
import { JobLocationsModule } from '../job-locations/job-locations.module';
import { PricingRule } from '../pricing-rules/entities/pricing-rule.entity';
import { RecruitmentBriefsModule } from '../recruitment-briefs/recruitment-briefs.module';
import { RecruitmentFeeQuotation } from '../recruitment-fee-quotations/entities/recruitment-fee-quotation.entity';
import { RecruitmentFeeQuotationsModule } from '../recruitment-fee-quotations/recruitment-fee-quotations.module';
import { IsNull, Repository } from 'typeorm';
import { JobClassification } from '../job-classifications/entities/job-classification.entity';
import { JobLocation } from '../job-locations/entities/job-location.entity';
import { PricingRulesModule } from '../pricing-rules/pricing-rules.module';

export const ImportFixture = [
  TypeOrmModule.forRoot(testDataSource as any),
  TypeOrmModule.forFeature([
    JobClassification,
    JobLocation,
    PricingRule,
    RecruitmentBrief,
    RecruitmentFeeQuotation,
    AgencyFeeQuotation
  ]),
  JobLocationsModule,
  JobClassificationsModule,
  PricingRulesModule,
  RecruitmentBriefsModule,
  RecruitmentFeeQuotationsModule,
  AgencyFeeQuotationsModule,
];

export const TestJobLocations_ForService = [
  { id: 'sydney', label: JSON.stringify({ en_GB: 'Sydney' }) },
  { id: 'melbourne', label: JSON.stringify({ en_GB: 'Melbourne' }) },
  { id: 'brisbane', label: JSON.stringify({ en_GB: 'Brisbane' }) },
  { id: 'canberra', label: JSON.stringify({ en_GB: 'Canberra' }) },
  { id: 'perth', label: JSON.stringify({ en_GB: 'Perth' }) },
  { id: 'adelaide', label: JSON.stringify({ en_GB: 'Adelaide' }) },
  { id: 'darwin', label: JSON.stringify({ en_GB: 'Darwin' }) },
];

export const TestJobClassifications_ForService = [
  { id: 'engineering', label: JSON.stringify({ en_GB: 'Engineering' }) },
  { id: 'accounting', label: JSON.stringify({ en_GB: 'Accounting' }) },
  { id: 'legal', label: JSON.stringify({ en_GB: 'Legal' }) },
  { id: 'construction', label: JSON.stringify({ en_GB: 'Construction' }) },
  {
    id: 'human-resources',
    label: JSON.stringify({ en_GB: 'Human Resources' }),
  },
  { id: 'sales', label: JSON.stringify({ en_GB: 'Sales' }) },
];

export const TestJobClassification_New = {
  id: 'marketing',
  label: JSON.stringify({ en_GB: 'Marketing' }),
};

export const TestPricingRule_New = {
    job_classification_id: 'engineering',
    job_location_id: 'melbourne',
    rate_recruitment_fee: 0.25,
    rate_agency_fee: 0.15,
};

export const TestPricingRules_ForService = [
  {
    job_classification_id: 'engineering',
    job_location_id: 'sydney',
    rate_recruitment_fee: 0.15,
    rate_agency_fee: 0.12,
  },
  {
    job_classification_id: 'accounting',
    job_location_id: 'melbourne',
    rate_recruitment_fee: 0.16,
    rate_agency_fee: 0.11,
  },
  {
    job_classification_id: 'legal',
    job_location_id: 'brisbane',
    rate_recruitment_fee: 0.14,
    rate_agency_fee: 0.1,
  },
  {
    job_classification_id: 'engineering',
    job_location_id: 'canberra',
    rate_recruitment_fee: 0.17,
    rate_agency_fee: 0.135,
  },
  {
    job_classification_id: 'accounting',
    job_location_id: 'perth',
    rate_recruitment_fee: 0.15,
    rate_agency_fee: 0.11,
  },
  {
    job_classification_id: 'construction',
    job_location_id: 'adelaide',
    rate_recruitment_fee: 0.16,
    rate_agency_fee: 0.12,
  },
  {
    job_classification_id: 'human-resources',
    job_location_id: 'darwin',
    rate_recruitment_fee: 0.13,
    rate_agency_fee: 0.09,
  },
  {
    job_classification_id: 'sales',
    job_location_id: 'perth',
    rate_recruitment_fee: 0.15,
    rate_agency_fee: 0.115,
  },
  {
    job_classification_id: 'legal',
    job_location_id: 'adelaide',
    rate_recruitment_fee: 0.11,
    rate_agency_fee: 0.09,
  },
  {
    job_classification_id: 'construction',
    job_location_id: 'sydney',
    rate_recruitment_fee: 0.16,
    rate_agency_fee: 0.12,
  },
];

export const expectedPagedResponse = {
    data: expect.any(Array),
    meta: {
        currentPage: expect.any(Number),
        totalPages: expect.any(Number),
        totalItems: expect.any(Number),
        itemsPerPage: expect.any(Number),
        sortBy: expect.any(Array),
    },
    links: expect.any(Object),
};

export const TestRecruitmentBriefs_ForService = TestPricingRules_ForService.map(
  (pricingRule, index) => ({
    job_classification_id: pricingRule.job_classification_id,
    job_location_id: pricingRule.job_location_id,
    job_title: faker.person.jobTitle(),
    job_role_description: faker.lorem.sentence(),
    annual_salary: faker.number.float({ min: 0, max: 1000000 }),
    author: index % 2 == 0 ? 'hirer' : 'hirer2',
    published_at: index % 3 == 0 ? faker.date.past().toISOString() : null,
  }),
);

export const TestRecruitmentBriefs_ForRepo =
  TestRecruitmentBriefs_ForService.map((recruitmentBrief, index) => ({
    ...recruitmentBrief,
    id: faker.string.uuid(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }));

export const createTestRecruitmentBrief = async (
  index: number,
  pricingRuleRepository: Repository<PricingRule>,
  recruitmentBriefRepository: Repository<RecruitmentBrief>,
) => {
  const pricingRule = await findTestPricingRule(index, pricingRuleRepository);
  await recruitmentBriefRepository.insert({
    ...TestRecruitmentBriefs_ForRepo[index],
    pricing_rule_id: pricingRule.id,
  });
  const recruitmentBrief = await recruitmentBriefRepository.findOneByOrFail({
    id: TestRecruitmentBriefs_ForRepo[index].id,
  });
  return { pricingRule, recruitmentBrief };
};

export const findTestPricingRule = async (
  index: number,
  pricingRuleRepository: Repository<PricingRule>,
) => {
  return await pricingRuleRepository.findOneByOrFail({
    job_classification_id:
      TestPricingRules_ForService[index].job_classification_id,
    job_location_id: TestPricingRules_ForService[index].job_location_id,
    invalidated_at: IsNull(),
  });
};

export const createTestFixture = async (module: TestingModule) => {
  const recruitmentFeeQuotationService =
    module.get<RecruitmentFeeQuotationsService>(
      RecruitmentFeeQuotationsService,
    );
  await recruitmentFeeQuotationService.clear();

  const agencyFeeQuotationService = module.get<AgencyFeeQuotationsService>(
    AgencyFeeQuotationsService,
  );
  await agencyFeeQuotationService.clear();

  const recruitmentBriefService = module.get<RecruitmentBriefsService>(
    RecruitmentBriefsService,
  );
  await recruitmentBriefService.clear();

  const pricingRulesService =
    module.get<PricingRulesService>(PricingRulesService);
  await pricingRulesService.clear();

  const jobLocationService =
    module.get<JobLocationsService>(JobLocationsService);
  await jobLocationService.clear();

  const jobClassificationService = module.get<JobClassificationsService>(
    JobClassificationsService,
  );
  await jobClassificationService.clear();

  for (const record of TestJobLocations_ForService)
    await jobLocationService.create(record);

  for (const record of TestJobClassifications_ForService)
    await jobClassificationService.create(record);

  for (const record of TestPricingRules_ForService)
    await pricingRulesService.create(record);

  const pricingRule = await pricingRulesService.findLatest(
    TestPricingRules_ForService[0].job_classification_id,
    TestPricingRules_ForService[0].job_location_id,
  );
  const recruitmentBrief = await recruitmentBriefService.create(
    TestRecruitmentBriefs_ForService[0],
    pricingRule,
  );

  return {
    jobLocationService,
    jobClassificationService,
    recruitmentBriefService,
    recruitmentFeeQuotationService,
    agencyFeeQuotationService,
    pricingRulesService,
    recruitmentBrief,
  };
};

export const expectJsonEquivalent = (object1: Object, object2: Object) => {
    expect(JSON.parse(JSON.stringify(object1))).toMatchObject(JSON.parse(JSON.stringify(object2)));
};
