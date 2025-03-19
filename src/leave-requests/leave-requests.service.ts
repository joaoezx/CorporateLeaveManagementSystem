import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaveRequest } from './schema/leave-request.entity';
import { User } from '../users/schema/user.schema';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { LeavePoliciesService } from '../leave-policies/leave-policies.service';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectModel(LeaveRequest.name)
    private readonly leaveModel: Model<LeaveRequest>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly leavePoliciesService: LeavePoliciesService,
  ) {}

  async requestLeave(userId: string, dto: CreateLeaveRequestDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new Error('User not found');

    const policy = await this.leavePoliciesService.getPolicy();
    const usedLeaveDays = await this.calculateUsedLeaveDays(userId);
    const requestLeaveDays = this.calculateLeaveDays(
      dto.startDate,
      dto.endDate,
    );

    if (usedLeaveDays + requestLeaveDays > policy.annualLeaveDays) {
      throw new Error('Annual leave days exceeded');
    }

    const leave = await this.leaveModel.create({
      ...dto,
      employee: user._id,
    });

    return leave;
  }

  async getEmployeeLeaves(userId: string) {
    return this.leaveModel
      .find({ employee: userId })
      .populate('employee')
      .exec();
  }

  async calculateUsedLeaveDays(userId: string) {
    const leaves = await this.getEmployeeLeaves(userId);
    return leaves.reduce(
      (total, leave) =>
        total + this.calculateLeaveDays(leave.startDate, leave.endDate),
      0,
    );
  }

  calculateLeaveDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // Inclui o último dia
  }

  async approveLeave(leaveId: string) {
    const leave = await this.leaveModel
      .findByIdAndUpdate(leaveId, { status: 'Approved' }, { new: true })
      .exec();
    return leave;
  }

  async rejectLeave(leaveId: string) {
    const leave = await this.leaveModel
      .findByIdAndUpdate(leaveId, { status: 'Rejected' }, { new: true })
      .exec();
    return leave;
  }
}
