import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
    TestPricingRule_New,
    TestJobLocations_ForService,
    createTestFixture,
    findTestPricingRule,
    expectJsonEquivalent,
    TestRecruitmentBriefs_ForService,
    expectedPagedResponse,
} from './../src/test-utils/fixture';
import { createTestToken } from './../src/test-utils/token';
import { AppRoles } from './../src/authentication/authentication.decorator';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecruitmentBrief } from './../src/recruitment-briefs/entities/recruitment-brief.entity';
import { PricingRule } from './../src/pricing-rules/entities/pricing-rule.entity';
import { before } from 'node:test';
import { RecruitmentFeeQuotation } from 'src/recruitment-fee-quotations/entities/recruitment-fee-quotation.entity';

describe('RecruitmentFeeQuotationsController (e2e)', () => {
    let app: INestApplication;
    let recruitmentBrief: RecruitmentBrief;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        const services = await createTestFixture(moduleFixture);
        recruitmentBrief = services.recruitmentBrief;
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/recruitment-briefs/:recruitment_brief_id/recruitment-fee-quotation', () => {
        let hirerToken: string;
        let hirer2Token: string;
        let recruiterToken: string;
        let publishedEntity: RecruitmentBrief;
        let unpublishedEntity: RecruitmentBrief;
        let expectedPublishedRecruitmentFeeQuotation: RecruitmentFeeQuotation;
        let expectedUnpublishedRecruitmentFeeQuotation: RecruitmentFeeQuotation;

        beforeEach(async () => {
            hirerToken = createTestToken(recruitmentBrief.author, AppRoles.HIRER);
            hirer2Token = createTestToken('hirer2', AppRoles.HIRER);
            recruiterToken = createTestToken('recruiter', AppRoles.RECRUITER);

            publishedEntity = (await request(app.getHttpServer())
                .post(`/recruitment-briefs`)
                .auth(hirerToken, { type: 'bearer' })
                .send({
                    ...TestRecruitmentBriefs_ForService[1],
                    published_at: new Date()
                })
                .expect(201)).body;
            unpublishedEntity = (await request(app.getHttpServer())
                .post(`/recruitment-briefs`)
                .auth(hirerToken, { type: 'bearer' })
                .send({
                    ...TestRecruitmentBriefs_ForService[2],
                    published_at: null
                })
                .expect(201)).body;
            expectedPublishedRecruitmentFeeQuotation = {
                created_at: expect.any(String),
                pricing_rule_id: publishedEntity.pricing_rule_id,
                recruitment_brief_id: publishedEntity.id,
                recruitment_fee: expect.any(Number),
                recruitment_fee_rate: expect.any(Number),
                id: expect.any(String),
                invalidated_at: null
            };
            expectedUnpublishedRecruitmentFeeQuotation = {
                created_at: expect.any(String),
                pricing_rule_id: unpublishedEntity.pricing_rule_id,
                recruitment_brief_id: unpublishedEntity.id,
                recruitment_fee: expect.any(Number),
                recruitment_fee_rate: expect.any(Number),
                id: expect.any(String),
                invalidated_at: null
            };
        });

        it('(GET) should return 401 without token', () => {
            return request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/recruitment-fee-quotation`)
                .expect(401);
        });

        it('(GET) should return 200 for owner', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/recruitment-fee-quotation`)
                .auth(hirerToken, { type: 'bearer' })
                .expect(res => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual(expectedPublishedRecruitmentFeeQuotation);
                });
        });

        it('(GET) should return 200 for unpublished entity accessed by owner', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${unpublishedEntity.id}/recruitment-fee-quotation`)
                .auth(hirerToken, { type: 'bearer' })
                .expect(res => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual(expectedUnpublishedRecruitmentFeeQuotation);
                });
        });

        it('(GET) should return 200 for published entity accessed by non-owner hirers', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/recruitment-fee-quotation`)
                .auth(hirer2Token, { type: 'bearer' })
                .expect(res => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual(expectedPublishedRecruitmentFeeQuotation);
                });
        });

        it('(GET) should return 403 for published entity accessed by non-owner recruiter', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/recruitment-fee-quotation`)
                .auth(recruiterToken, { type: 'bearer' })
                .expect(403);
        });

        it('(GET) should return 404 for unpublished entity accessed by non-owner hirers', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${unpublishedEntity.id}/recruitment-fee-quotation`)
                .auth(hirer2Token, { type: 'bearer' })
                .expect(404);
        });

        it('(POST) should return 404', () => {
            return request(app.getHttpServer())
                .post(`/recruitment-briefs/${publishedEntity.id}/recruitment-fee-quotation`)
                .auth(hirerToken, { type: 'bearer' })
                .send({ recruitment_fee: 1000 })
                .expect(404);
        });

        it('(DELETE) should return 404', () => {
            return request(app.getHttpServer())
                .delete(`/recruitment-briefs/${recruitmentBrief.id}/recruitment-fee-quotation`)
                .auth(hirerToken, { type: 'bearer' })
                .expect(404);
        });
    });
});
