import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
    createTestFixture,
    TestRecruitmentBriefs_ForService,
} from './../src/test-utils/fixture';
import { createTestToken } from './../src/test-utils/token';
import { AppRoles } from './../src/authentication/authentication.decorator';
import { RecruitmentBrief } from './../src/recruitment-briefs/entities/recruitment-brief.entity';
import { AgencyFeeQuotation } from 'src/agency-fee-quotations/entities/agency-fee-quotation.entity';

describe('AgencyFeeQuotationsController (e2e)', () => {
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

    describe('/recruitment-briefs/:recruitment_brief_id/agency-fee-quotation', () => {
        let hirerToken: string;
        let hirer2Token: string;
        let recruiterToken: string;
        let publishedEntity: RecruitmentBrief;
        let unpublishedEntity: RecruitmentBrief;
        let expectedPublishedAgencyFeeQuotation: AgencyFeeQuotation;
        let expectedUnpublishedAgencyFeeQuotation: AgencyFeeQuotation;

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

            expectedPublishedAgencyFeeQuotation = {
                created_at: expect.any(String),
                pricing_rule_id: publishedEntity.pricing_rule_id,
                recruitment_brief_id: publishedEntity.id,
                agency_fee: expect.any(Number),
                agency_fee_rate: expect.any(Number),
                id: expect.any(String),
                invalidated_at: null
            };
            expectedUnpublishedAgencyFeeQuotation = {
                created_at: expect.any(String),
                pricing_rule_id: unpublishedEntity.pricing_rule_id,
                recruitment_brief_id: unpublishedEntity.id,
                agency_fee: expect.any(Number),
                agency_fee_rate: expect.any(Number),
                id: expect.any(String),
                invalidated_at: null
            };
        });

        it('(GET) should return 401 without token', () => {
            return request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/agency-fee-quotation`)
                .expect(401);
        });

        it('(GET) should return 200 for published entity accessed by recruiter', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/agency-fee-quotation`)
                .auth(recruiterToken, { type: 'bearer' })
                .expect(res => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual(expectedPublishedAgencyFeeQuotation);
                });
        });

        it('(GET) should return 404 for unpublished entity accessed by recruiter', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${unpublishedEntity.id}/agency-fee-quotation`)
                .auth(recruiterToken, { type: 'bearer' })
                .expect(404);
        });

        it('(GET) should return 403 for published entities accessed by others', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${publishedEntity.id}/agency-fee-quotation`)
                .auth(hirerToken, { type: 'bearer' })
                .expect(403);
        });

        it('(GET) should return 403 for unpublished entities accessed by others', async () => {
            await request(app.getHttpServer())
                .get(`/recruitment-briefs/${unpublishedEntity.id}/agency-fee-quotation`)
                .auth(hirerToken, { type: 'bearer' })
                .expect(403);
        });

        it('(POST) should return 404', () => {
            return request(app.getHttpServer())
                .post(`/recruitment-briefs/${publishedEntity.id}/agency-fee-quotation`)
                .auth(recruiterToken, { type: 'bearer' })
                .send({ agency_fee: 1000 })
                .expect(404);
        });

        it('(DELETE) should return 404', () => {
            return request(app.getHttpServer())
                .delete(`/recruitment-briefs/${recruitmentBrief.id}/agency-fee-quotation`)
                .auth(recruiterToken, { type: 'bearer' })
                .expect(404);
        });
    });
});
