import { Injectable } from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async requestLeave(userId: string, dto: CreateLeaveRequestDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

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

  async approveLeave(leaveId: string) {
    await this.leaveRepository.update(leaveId, { status: 'Approved' });
    return this.leaveRepository.findOne({ where: { id: leaveId } });
  }

  async rejectLeave(leaveId: string) {
    await this.leaveRepository.update(leaveId, { status: 'Rejected' });
    return this.leaveRepository.findOne({ where: { id: leaveId } });
  }
}
