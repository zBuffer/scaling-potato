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
} from './../src/test-utils/fixture';
import { createTestToken } from './../src/test-utils/token';
import { AppRoles } from './../src/authentication/authentication.decorator';
import { Repository } from 'typeorm';
import { PricingRule } from './../src/pricing-rules/entities/pricing-rule.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PricingRulesController (e2e)', () => {
    let app: INestApplication;
    let pricingRuleRepository: Repository<PricingRule>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await createTestFixture(moduleFixture);

        pricingRuleRepository = moduleFixture.get(
            getRepositoryToken(PricingRule),
        );
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/pricing-rules', () => {
        it('(GET) should return 401 without token', () => {
            return request(app.getHttpServer())
                .get('/pricing-rules')
                .expect(401);
        });

        it('(POST) should return 401 without token', () => {
            return request(app.getHttpServer())
                .post(`/pricing-rules`)
                .send(TestPricingRule_New)
                .expect(401);
        });

        it('(POST) should return 201 for user of product role', () => {
            const token = createTestToken('user', AppRoles.PRODUCT);
            return request(app.getHttpServer())
                .post(`/pricing-rules`)
                .auth(token, { type: 'bearer' })
                .send(TestPricingRule_New)
                .expect(201);
        });

        it('(POST) should return 403 for user of other roles', () => {
            const token = createTestToken('user', AppRoles.HIRER);
            return request(app.getHttpServer())
                .post(`/pricing-rules`)
                .auth(token, { type: 'bearer' })
                .send(TestPricingRule_New)
                .expect(403);
        });

        it('(DELETE) should return 404 without token', () => {
            return request(app.getHttpServer())
                .delete('/pricing-rules')
                .expect(404);
        });

        describe('/:id', () => {
            let pricingRule: { id: string };
            let productToken: string;
            let hirerToken: string;

            beforeEach(async () => {
                pricingRule = await findTestPricingRule(0, pricingRuleRepository);
                productToken = createTestToken('user', AppRoles.PRODUCT);
                hirerToken = createTestToken('user', AppRoles.HIRER);
            });
            
            it('(GET) should return entity for user of product role', () => {
                return request(app.getHttpServer())
                    .get(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .auth(productToken, { type: 'bearer' })
                    .expect(res => {
                        expect(res.statusCode).toBe(200);
                        expectJsonEquivalent(res.body, pricingRule);
                    });
            });

            it('(GET) should return 401 without token', () => {
                return request(app.getHttpServer())
                    .get(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .expect(401);
            });

            it('(GET) should return 403 for roles other than product', () => {
                return request(app.getHttpServer())
                    .get(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .auth(hirerToken, { type: 'bearer' })
                    .expect(403);
            });

            it('(GET) should return 404 for non-existent entity', () => {
                return request(app.getHttpServer())
                    .get('/pricing-rules/abracadabra')
                    .auth(productToken, { type: 'bearer' })
                    .expect(404);
            });

            it('(PATCH) invalidate should return 204 for product role', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .send({ invalidated_at: new Date() })
                    .auth(productToken, { type: 'bearer' })
                    .expect(204);
            });

            it('(PATCH) validate should return 204 for product role', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .send({ invalidated_at: null })
                    .auth(productToken, { type: 'bearer' })
                    .expect(204);
            });

            it('(PATCH) should return 401 without token', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .send({ invalidated_at: new Date() })
                    .expect(401);
            });

            it('(PATCH) should return 403 for roles other than product', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .send({ invalidated_at: new Date() })
                    .auth(hirerToken, { type: 'bearer' })
                    .expect(403);
            });

            it('(DELETE) should return 404', () => {
                return request(app.getHttpServer())
                    .delete(
                        `/pricing-rules/${pricingRule.id}`,
                    )
                    .auth(productToken, { type: 'bearer' })
                    .expect(404);
            });
        });
    });
});
