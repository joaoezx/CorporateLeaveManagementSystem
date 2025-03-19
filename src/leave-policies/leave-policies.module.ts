import { Module } from '@nestjs/common';
import { LeavePoliciesService } from './leave-policies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LeavePolicy, LeavePolicySchema } from './schema/leave-policy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeavePolicy.name, schema: LeavePolicySchema },
    ]),
  ],
  providers: [LeavePoliciesService],
  exports: [LeavePoliciesService],
})
export class LeavePoliciesModule {}
