import { Module } from '@nestjs/common';
import { AccesskeyService } from './service/accesskey.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AccesskeyService],
  exports: [AccesskeyService],
})
export class AccesskeyModule {}
