import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveRequestsService } from './leave-requests.service';
import {
  LeaveRequest,
  LeaveRequestSchema,
} from '@leave-requests/schema/leave-request.entity';
import { User } from 'users/schema/user.schema';
import { UserSchema } from 'users/schema/user.schema';
import { EmailModule } from 'email/email.module';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: LeaveRequest.name, schema: LeaveRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [LeaveRequestsService],
  exports: [LeaveRequestsService],
})
export class LeaveRequestsModule {}
