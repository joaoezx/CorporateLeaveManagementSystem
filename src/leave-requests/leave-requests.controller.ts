import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('leave-request')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post(':userId/request')
  @UseGuards(AuthGuard('jwt'))
  async requestLeave(
    @Param('userId') userId: string,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.leaveRequestsService.requestLeave(userId, dto);
  }

  @Get('employee/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getEmployeeLeaves(@Param('userId') userId: string) {
    return this.leaveRequestsService.getEmployeeLeaves(userId);
  }

  @Put('reject/:leaveId')
  @UseGuards(AuthGuard('jwt'))
  async rejectLeave(@Param('leaveId') leaveId: string) {
    return this.leaveRequestsService.rejectLeave(leaveId);
  }

  @Put('approve/:leaveId')
  @UseGuards(AuthGuard('jwt'))
  async approveLeave(@Param('leaveId') leaveId: string) {
    return this.leaveRequestsService.approveLeave(leaveId);
  }
}
