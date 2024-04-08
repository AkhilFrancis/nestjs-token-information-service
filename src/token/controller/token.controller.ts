import { Controller, Get, Query } from '@nestjs/common';
import { TokenService } from '../service/token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  async getToken(@Query('accessKey') accessKey: string) {
    if (!accessKey) {
      throw new Error('Access key is required.');
    }
    return this.tokenService.getTokenInformation(accessKey);
  }
}
