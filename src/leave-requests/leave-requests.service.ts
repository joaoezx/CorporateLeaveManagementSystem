import { Injectable } from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LeavePoliciesService } from '../leave-policies/leave-policies.service';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly leavePoliciesService: LeavePoliciesService,
  ) {}

  async requestLeave(userId: string, dto: CreateLeaveRequestDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const policy = await this.leavePoliciesService.getPolicy();
    const usedLeaveDays = await this.calculateUsedLeaveDays(userId);
    const requestLeaveDays = await this.calculateLeaveDays(
      dto.startDate,
      dto.endDate,
    );

    if (usedLeaveDays + requestLeaveDays > policy.annualLeaveDays) {
      throw new Error('Annual leave days exceeded');
    }

    const leave = this.leaveRepository.create({
      ...dto,
      employee: user,
    });

    return this.leaveRepository.save(leave);
  }

  async getEmployeeLeaves(userId: string) {
    return this.leaveRepository.find({
      where: { employee: { id: userId } },
      relations: ['employee'],
    });
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
    await this.leaveRepository.update(leaveId, { status: 'Approved' });
    return this.leaveRepository.findOne({ where: { id: leaveId } });
  }

  async rejectLeave(leaveId: string) {
    await this.leaveRepository.update(leaveId, { status: 'Rejected' });
    return this.leaveRepository.findOne({ where: { id: leaveId } });
  }
}
