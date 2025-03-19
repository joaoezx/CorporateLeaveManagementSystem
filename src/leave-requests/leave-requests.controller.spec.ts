import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';

describe('LeaveRequestsController', () => {
  let controller: LeaveRequestsController;
  let leaveRequestsService: LeaveRequestsService;

  const mockLeaveRequestsService = {
    requestLeave: jest.fn(),
    getEmployeeLeaves: jest.fn(),
    rejectLeave: jest.fn(),
    approveLeave: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveRequestsController],
      providers: [
        {
          provide: LeaveRequestsService,
          useValue: mockLeaveRequestsService,
        },
      ],
    }).compile();

    controller = module.get<LeaveRequestsController>(LeaveRequestsController);
    leaveRequestsService =
      module.get<LeaveRequestsService>(LeaveRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call requestLeave method from service', async () => {
    const userId = '123';
    const dto: CreateLeaveRequestDto = {
      startDate: '2025-03-05',
      endDate: '2025-03-10',
      leaveType: 'Vacation',
    };

    await controller.requestLeave(userId, dto);

    expect(leaveRequestsService.requestLeave).toHaveBeenCalledWith(userId, dto);
  });

  it('should call getEmployeeLeaves method from service', async () => {
    const userId = '123';
    await controller.getEmployeeLeaves(userId);

    expect(leaveRequestsService.getEmployeeLeaves).toHaveBeenCalledWith(userId);
  });

  it('should call rejectLeave method from service', async () => {
    const leaveId = 'leave_123';
    await controller.rejectLeave(leaveId);

    expect(leaveRequestsService.rejectLeave).toHaveBeenCalledWith(leaveId);
  });

  it('should call approveLeave method from service', async () => {
    const leaveId = 'leave_123';
    await controller.approveLeave(leaveId);

    expect(leaveRequestsService.approveLeave).toHaveBeenCalledWith(leaveId);
  });
});
