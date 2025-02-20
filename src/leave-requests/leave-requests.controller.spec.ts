import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequest } from './entities/leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { User } from '../users/entities/user.entity';
import { LeaveRequestsController } from './leave-requests.controller';

describe('LeaveRequestsController', () => {
  let controller: LeaveRequestsController;
  let service: LeaveRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveRequestsController],
      providers: [
        {
          provide: LeaveRequestsService, // Mocka o serviço de usuários
          useValue: {
            requestLeave: jest.fn(), // Mocka a função de criação de usuário
            getEmployeeLeaves: jest.fn(), // Mocka a função de busca por ID
            rejectLeave: jest.fn(), // Mocka a função de promoção de usuário
            approveLeave: jest.fn(), // Mocka a função de remoção de usuário
          },
        },
      ],
    }).compile();

    controller = module.get<LeaveRequestsController>(LeaveRequestsController);
    service = module.get<LeaveRequestsService>(LeaveRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'XXXXXXXXXXX',
    department: 'IT',
    role: 'Manager',
    leaveRequests: [],
  };

  const leaveDto: CreateLeaveRequestDto = {
    startDate: '21-02-2020',
    endDate: '22-02-2020',
    leaveType: 'Sick',
  };

  const leaveRequest: LeaveRequest = {
    id: 'leave-1',
    startDate: leaveDto.startDate,
    endDate: leaveDto.endDate,
    leaveType: leaveDto.leaveType,
    status: 'pending',
    employee: user,
  };

  it('should request leave', async () => {
    jest.spyOn(service, 'requestLeave').mockResolvedValue(leaveRequest);

    const result = await controller.requestLeave(user.id, leaveDto);
    expect(result).toEqual(leaveRequest);
    expect(service.requestLeave).toHaveBeenCalledWith(user.id, leaveDto);
  });

  it('should employees leaves', async () => {
    jest.spyOn(service, 'getEmployeeLeaves').mockResolvedValue([leaveRequest]);

    const result = await controller.getEmployeeLeaves(user.id);
    expect(result).toEqual([leaveRequest]);
    expect(service.getEmployeeLeaves).toHaveBeenCalledWith(user.id);
  });

  it('should reject leave', async () => {
    jest.spyOn(service, 'rejectLeave').mockResolvedValue(leaveRequest);

    const result = await controller.rejectLeave('Reject');
    expect(result).toEqual(leaveRequest);
    expect(service.rejectLeave).toHaveBeenCalledWith('Reject');
  });

  it('should approve leave', async () => {
    jest.spyOn(service, 'approveLeave').mockResolvedValue(leaveRequest);

    const result = await controller.approveLeave('Approve');
    expect(result).toEqual(leaveRequest);
    expect(service.approveLeave).toHaveBeenCalledWith('Approve');
  });
});
