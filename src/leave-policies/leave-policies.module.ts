import { Module } from '@nestjs/common';
import { LeavePoliciesService } from './leave-policies.service';
import { LeavePoliciesController } from './leave-policies.controller';

@Module({
  controllers: [LeavePoliciesController],
  providers: [LeavePoliciesService],
})
export class LeavePoliciesModule {}
