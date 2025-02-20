import { IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  leaveType: string;
}
