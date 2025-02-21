import { Module } from '@nestjs/common';
import { LeavePoliciesService } from './leave-policies.service';

@Module({
  providers: [LeavePoliciesService],
  exports: [LeavePoliciesService],
})
export class LeavePoliciesModule {}
