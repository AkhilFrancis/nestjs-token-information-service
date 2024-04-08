import { Module } from '@nestjs/common';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { AccesskeyModule } from 'src/accesskey/accesskey.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLog } from './entity/request-log.entity';

@Module({
  imports: [AccesskeyModule, TypeOrmModule.forFeature([RequestLog])],
  controllers: [TokenController],
  providers: [TokenService]
})
export class TokenModule {}
