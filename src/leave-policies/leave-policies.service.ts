import { Injectable } from '@nestjs/common';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';

@Injectable()
export class LeavePoliciesService {
  create(createLeavePolicyDto: CreateLeavePolicyDto) {
    return 'This action adds a new leavePolicy';
  }

  findAll() {
    return `This action returns all leavePolicies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leavePolicy`;
  }

  update(id: number, updateLeavePolicyDto: UpdateLeavePolicyDto) {
    return `This action updates a #${id} leavePolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} leavePolicy`;
  }
}
