import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Accesskey } from '../interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccesskeyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAccessKey(accessKey: string): Promise<Accesskey> {
    try {
      // Make request to Microservice 1 to validate access key
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('ACCESSKEY_MICROSERVICE_ENDPOINT')}/access-keys/${accessKey}`,
        ),
      );
      return response.data;
    } catch (error) {
      console.error('Error getting access key:', error);
      return undefined;
    }
  }
}
