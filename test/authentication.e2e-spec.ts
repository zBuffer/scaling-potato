import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
    createTestFixture,
} from './../src/test-utils/fixture';
import { createTestToken } from './../src/test-utils/token';
import { AppRoles } from './../src/authentication/authentication.decorator';
import { jwtConfig } from './../src/env';

describe('AuthenticationController (e2e)', () => {
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

    describe('/whoami', () => {
        it('(GET) should return 401 without token', () => {
            return request(app.getHttpServer())
                .get('/whoami')
                .expect(401);
        });

        it('(GET) should return user info with token', () => {
            const token = createTestToken('user', AppRoles.PRODUCT);
            return request(app.getHttpServer())
                .get('/whoami')
                .auth(token, { type: 'bearer' })
                .expect(res => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual({
                        sub: 'user',
                        roles: [AppRoles.PRODUCT],
                        iat: expect.any(Number),
                        exp: expect.any(Number),
                        iss: jwtConfig.issuer,
                        jti: expect.any(String)
                    });
                });
        });
    });
});
