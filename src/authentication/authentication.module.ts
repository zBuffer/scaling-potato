import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../env';
import { AuthGuard } from './authentication.guard';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      publicKey: jwtConfig.public_key,
      verifyOptions: {
        ignoreExpiration: false,
        issuer: jwtConfig.issuer,
      }
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
