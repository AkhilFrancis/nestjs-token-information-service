import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Accesskey } from '../interface';

@Injectable()
export class AccesskeyService {
  constructor(private readonly httpService: HttpService) {}

  async getAccessKey(accessKey: string): Promise<Accesskey> {
    try {
      // Make request to Microservice 1 to validate access key
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3000/access-keys/${accessKey}`),
      );
      return response.data;
    } catch (error) {
      console.error('Error getting access key:', error);
      return undefined;
    }
  }
}
