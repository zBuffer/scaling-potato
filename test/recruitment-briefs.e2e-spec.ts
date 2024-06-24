import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
    createTestFixture,
    expectJsonEquivalent,
    TestRecruitmentBriefs_ForService,
    expectedPagedResponse,
} from './../src/test-utils/fixture';
import { createTestToken } from './../src/test-utils/token';
import { AppRoles } from './../src/authentication/authentication.decorator';
import { RecruitmentBrief } from './../src/recruitment-briefs/entities/recruitment-brief.entity';

describe('RecruitmentBriefsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await createTestFixture(moduleFixture);
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/recruitment-briefs', () => {
        let hirerToken: string;
        let hirer2Token: string;
        let recruiterToken: string;

        beforeEach(async () => {
            hirerToken = createTestToken('hirer', AppRoles.HIRER);
            hirer2Token = createTestToken('hirer2', AppRoles.HIRER);
            recruiterToken = createTestToken('recruiter', AppRoles.RECRUITER);
        });

        it('(GET) should return 401 without token', () => {
            return request(app.getHttpServer())
                .get('/recruitment-briefs')
                .expect(401);
        });

        it('(GET) should return 200 for authenticated users', async () => {
            for (const token of [hirerToken, recruiterToken]) {
                await request(app.getHttpServer())
                    .get('/recruitment-briefs')
                    .auth(token, { type: 'bearer' })
                    .expect(res => {
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toEqual(expectedPagedResponse);
                    });
            }
        });

        it('(POST) should return 401 without token', () => {
            return request(app.getHttpServer())
                .post(`/recruitment-briefs`)
                .send(TestRecruitmentBriefs_ForService[0])
                .expect(401);
        });

        it('(POST) should return 201 for user of hirer role', () => {
            return request(app.getHttpServer())
                .post(`/recruitment-briefs`)
                .auth(hirerToken, { type: 'bearer' })
                .send(TestRecruitmentBriefs_ForService[0])
                .expect(201);
        });

        it('(POST) should return 403 for user of other roles', () => {
            return request(app.getHttpServer())
                .post(`/recruitment-briefs`)
                .auth(recruiterToken, { type: 'bearer' })
                .send(TestRecruitmentBriefs_ForService[0])
                .expect(403);
        });

        it('(DELETE) should return 404 without token', () => {
            return request(app.getHttpServer())
                .delete('/recruitment-briefs')
                .expect(404);
        });

        describe('/:id', () => {
            let publishedEntity: RecruitmentBrief;
            let unpublishedEntity: RecruitmentBrief;

            beforeEach(async () => {
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
            });

            it('(GET) should return published entity regardless of ownership', () => {
                return request(app.getHttpServer())
                    .get(
                        `/recruitment-briefs/${publishedEntity.id}`,
                    )
                    .auth(recruiterToken, { type: 'bearer' })
                    .expect(res => {
                        expect(res.statusCode).toBe(200);
                        expectJsonEquivalent(res.body, publishedEntity);
                    });
            });

            it('(GET) should return unpublished entity for owner', () => {
                return request(app.getHttpServer())
                    .get(
                        `/recruitment-briefs/${unpublishedEntity.id}`,
                    )
                    .auth(hirerToken, { type: 'bearer' })
                    .expect(res => {
                        expect(res.statusCode).toBe(200);
                        expectJsonEquivalent(res.body, unpublishedEntity);
                    });
            });

            it('(GET) should return 404 for unpublished entity not owned by user', () => {
                return request(app.getHttpServer())
                    .get(
                        `/recruitment-briefs/${unpublishedEntity.id}`,
                    )
                    .auth(recruiterToken, { type: 'bearer' })
                    .expect(404);
            });

            it('(GET) should return 401 without token', () => {
                return request(app.getHttpServer())
                    .get(
                        `/recruitment-briefs/${publishedEntity.id}`,
                    )
                    .expect(401);
            });

            it('(GET) should return 404 for non-existent entity', () => {
                return request(app.getHttpServer())
                    .get('/recruitment-briefs/abracadabra')
                    .auth(hirerToken, { type: 'bearer' })
                    .expect(404);
            });

            it('(PATCH) should return 204 for owner', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/recruitment-briefs/${publishedEntity.id}`,
                    )
                    .send({ job_title: 'New Job Title' })
                    .auth(hirerToken, { type: 'bearer' })
                    .expect(204);
            });

            it('(PATCH) should return 404 if not owned by user', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/recruitment-briefs/${publishedEntity.id}`,
                    )
                    .send({ job_title: 'New Job Title' })
                    .auth(hirer2Token, { type: 'bearer' })
                    .expect(404);
            });

            it('(PATCH) should return 401 without token', () => {
                return request(app.getHttpServer())
                    .patch(
                        `/recruitment-briefs/${publishedEntity.id}`,
                    )
                    .send({ job_title: 'New Job Title' })
                    .expect(401);
            });

            it('(DELETE) should return 404', () => {
                return request(app.getHttpServer())
                    .delete(
                        `/recruitment-briefs/${publishedEntity.id}`,
                    )
                    .auth(hirerToken, { type: 'bearer' })
                    .expect(404);
            });
        });
    });
});
