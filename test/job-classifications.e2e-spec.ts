import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  TestJobClassification_New,
  TestJobClassifications_ForService,
  createTestFixture,
  expectedPagedResponse,
} from './../src/test-utils/fixture';
import { createTestToken } from './../src/test-utils/token';
import { AppRoles } from './../src/authentication/authentication.decorator';

describe('JobClassificationsController (e2e)', () => {
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

  describe('/job-classifications', () => {
    it('(GET) should return paged response without token', () => {
      return request(app.getHttpServer())
        .get('/job-classifications')
        .expect((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual(expectedPagedResponse);
        });
    });

    it('(POST) should return 401 without token', () => {
      return request(app.getHttpServer())
        .post(`/job-classifications`)
        .send(TestJobClassification_New)
        .expect(401);
    });

    it('(POST) should return 201 for user of product role', () => {
      const token = createTestToken('user', AppRoles.PRODUCT);
      return request(app.getHttpServer())
        .post(`/job-classifications`)
        .auth(token, { type: 'bearer' })
        .send(TestJobClassification_New)
        .expect(201);
    });

    it('(POST) should return 403 for user of other roles', () => {
      const token = createTestToken('user', AppRoles.HIRER);
      return request(app.getHttpServer())
        .post(`/job-classifications`)
        .auth(token, { type: 'bearer' })
        .send(TestJobClassification_New)
        .expect(403);
    });

    it('(DELETE) should return 404', () => {
      return request(app.getHttpServer())
        .delete('/job-classifications')
        .expect(404);
    });

    describe('/:id', () => {
      it('(GET) should return entity without token', () => {
        return request(app.getHttpServer())
          .get(
            `/job-classifications/${TestJobClassifications_ForService[0].id}`,
          )
          .expect(200, TestJobClassifications_ForService[0]);
      });

      it('(GET) should return 404 for non-existent entity', () => {
        return request(app.getHttpServer())
          .get('/job-classifications/abracadabra')
          .expect(404);
      });

      it('(PATCH) should return 401 without token', () => {
        return request(app.getHttpServer())
          .patch(
            `/job-classifications/${TestJobClassifications_ForService[0].id}`,
          )
          .send(TestJobClassification_New)
          .expect(401);
      });
    });
  });
});
