import {
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccesskeyService } from 'src/accesskey/service/accesskey.service';
import { MoreThan, Repository } from 'typeorm';
import { RequestLog } from '../entity/request-log.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly accessKeyService: AccesskeyService,
    @InjectRepository(RequestLog)
    private readonly requestLogRepository: Repository<RequestLog>,
  ) {}

  async getTokenInformation(accessKeyString: string): Promise<any> {
    const accessKey = await this.accessKeyService.getAccessKey(accessKeyString);

    if (!accessKey || new Date(accessKey.expiresAt) < new Date()) {
      throw new ForbiddenException('Access key is invalid or expired.');
    }

    const currentTime = new Date();
    const timeLimit = new Date(
      currentTime.getTime() - accessKey.rateLimitPeriod * 1000, // assuming rateLimitPeriod is in seconds :)
    );

    const recentRequestsCount = await this.requestLogRepository.count({
      where: {
        accessKey: accessKeyString,
        requestedAt: MoreThan(timeLimit),
      },
    });

    if (recentRequestsCount >= accessKey.rateLimit) {
      throw new RequestTimeoutException('Rate limit exceeded.');
    }

    await this.requestLogRepository.save({
      accessKey: accessKeyString,
      requestedAt: new Date(),
    });

    return { token: 'your-token-information' };
  }
}
