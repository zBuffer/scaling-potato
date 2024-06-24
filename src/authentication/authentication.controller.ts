import { Controller, Get, Req } from '@nestjs/common';

@Controller('whoami')
export class AuthenticationController {
  @Get()
  whoami(@Req() req: any) {
    return req.user;
  }
}
