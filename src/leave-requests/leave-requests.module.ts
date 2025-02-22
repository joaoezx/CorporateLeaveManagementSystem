import { Module } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestsController } from './leave-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { User } from '../users/entities/user.entity';
import { LeavePoliciesModule } from '@leave-policies/leave-policies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, User, LeavePoliciesModule]),
  ],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
})
export class LeaveRequestsModule {}
