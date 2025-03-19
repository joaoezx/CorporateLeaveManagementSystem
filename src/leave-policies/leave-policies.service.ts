import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeavePolicy } from './schema/leave-policy.schema';
import { Model } from 'mongoose';

@Injectable()
export class LeavePoliciesService {
  constructor(
    @InjectModel(LeavePolicy.name) private policyModel: Model<LeavePolicy>,
  ) {}

  async getPolicy() {
    let policy = await this.policyModel.findOne().exec();
    if (!policy) {
      policy = await this.policyModel.create({
        annualLeaveDays: 20,
        sickLeaveDays: 5,
      });
    }
    return policy;
  }
}
