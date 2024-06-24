import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../env';
import { randomUUID } from 'crypto';

const testPrivateKey =
  '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgevZzL1gdAFr88hb2\nOF/2NxApJCzGCEDdfSp6VQO30hyhRANCAAQRWz+jn65BtOMvdyHKcvjBeBSDZH2r\n1RTwjmYSi9R/zpBnuQ4EiMnCqfMPWiZqB4QdbAd0E7oH50VpuZ1P087G\n-----END PRIVATE KEY-----';
export const createTestToken = (sub: string, ...roles: string[]) => {
  const service = new JwtService({
    privateKey: testPrivateKey,
    signOptions: {
      expiresIn: '1h',
      algorithm: jwtConfig.algorithm as any,
      issuer: jwtConfig.issuer
    },
  });
  return service.sign({ sub, roles, jti: randomUUID() });
};
