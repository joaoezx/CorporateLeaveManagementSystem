import { Injectable } from '@nestjs/common';

@Injectable()
export class LeavePoliciesService {
  private readonly annualLeaveDays = 20;

  getPolicy() {
    return { annualLeaveDays: this.annualLeaveDays };
  }
}
