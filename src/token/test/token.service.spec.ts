import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestLog } from '../entity/request-log.entity';
import { Repository } from 'typeorm';
import { ForbiddenException, RequestTimeoutException } from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { AccesskeyService } from '../../accesskey/service/accesskey.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockAccessKeyService = {
  getAccessKey: jest.fn(),
};

const mockRequestLogRepository = (): MockRepository<RequestLog> => ({
  count: jest.fn(),
  save: jest.fn(),
});

describe('TokenService', () => {
  let service: TokenService;
  let accessKeyService: AccesskeyService;
  let requestLogRepository: MockRepository<RequestLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: AccesskeyService,
          useValue: mockAccessKeyService,
        },
        {
          provide: getRepositoryToken(RequestLog),
          useFactory: mockRequestLogRepository,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    accessKeyService = module.get<AccesskeyService>(AccesskeyService);
    requestLogRepository = module.get<MockRepository<RequestLog>>(
      getRepositoryToken(RequestLog),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokenInformation', () => {
    it('should throw ForbiddenException for invalid or expired access keys', async () => {
      mockAccessKeyService.getAccessKey.mockResolvedValue(null);

      await expect(service.getTokenInformation('invalidKey')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw RequestTimeoutException when rate limit is exceeded', async () => {
      const accessKey = {
        expiresAt: new Date(Date.now() + 10000),
        rateLimit: 1,
        rateLimitPeriod: 60,
      };
      mockAccessKeyService.getAccessKey.mockResolvedValue(accessKey);
      requestLogRepository.count.mockResolvedValue(accessKey.rateLimit);

      await expect(service.getTokenInformation('validKey')).rejects.toThrow(
        RequestTimeoutException,
      );
    });

    it('should return token information when access key is valid and rate limit not exceeded', async () => {
      const accessKey = {
        expiresAt: new Date(Date.now() + 10000),
        rateLimit: 2,
        rateLimitPeriod: 60,
      };
      mockAccessKeyService.getAccessKey.mockResolvedValue(accessKey);
      requestLogRepository.count.mockResolvedValue(0);
      requestLogRepository.save.mockResolvedValue(undefined); // Assuming save doesn't return useful info

      await expect(service.getTokenInformation('validKey')).resolves.toEqual({
        token: 'your-token-information',
      });
    });
  });
});
