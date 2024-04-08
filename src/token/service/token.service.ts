import {
  ForbiddenException,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccesskeyService } from '../../accesskey/service/accesskey.service';
import { MoreThan, Repository } from 'typeorm';
import { RequestLog } from '../entity/request-log.entity';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private readonly accessKeyService: AccesskeyService,
    @InjectRepository(RequestLog)
    private readonly requestLogRepository: Repository<RequestLog>,
  ) {}

  async getTokenInformation(accessKeyString: string): Promise<any> {
    try {
      const accessKey =
        await this.accessKeyService.getAccessKey(accessKeyString);

      if (!accessKey || new Date(accessKey.expiresAt) < new Date()) {
        this.logger.warn(
          `Access key is invalid or expired: ${accessKeyString}`,
        );
        throw new ForbiddenException('Access key is invalid or expired.');
      }

      const currentTime = new Date();
      const timeLimit = new Date(
        currentTime.getTime() - accessKey.rateLimitPeriod * 1000,
      );

      const recentRequestsCount = await this.requestLogRepository.count({
        where: {
          accessKey: accessKeyString,
          requestedAt: MoreThan(timeLimit),
        },
      });

      if (recentRequestsCount >= accessKey.rateLimit) {
        this.logger.warn(
          `Rate limit exceeded for access key: ${accessKeyString}`,
        );
        throw new RequestTimeoutException('Rate limit exceeded.');
      }

      await this.requestLogRepository.save({
        accessKey: accessKeyString,
        requestedAt: new Date(),
      });

      this.logger.log(
        `Token information retrieved successfully for access key: ${accessKeyString}`,
      );
      return { token: 'your-token-information' };
    } catch (error) {
      this.logger.error(
        `Error getting token information for access key: ${accessKeyString}`,
        error.stack,
      );
      throw error;
    }
  }
}
