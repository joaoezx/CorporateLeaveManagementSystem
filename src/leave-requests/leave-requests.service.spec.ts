import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestsService } from './leave-requests.service';
import { Repository } from 'typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { User } from '../users/entities/user.entity';
import { LeavePoliciesService } from '../leave-policies/leave-policies.service';

describe('LeaveRequestsService', () => {
  let leaveService: LeaveRequestsService;
  let leaveRequestRepository: Repository<LeaveRequest>;
  let userRepository: Repository<User>;
  let leavePoliciesService: LeavePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaveRequestsService,
        {
          provide: getRepositoryToken(LeaveRequest),
          useClass: Repository, // Simulação do Repository
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: LeavePoliciesService,
          useValue: {
            getPolicy: jest.fn().mockReturnValue({ annualLeaveDays: 20 }),
          },
        },
      ],
    }).compile();

    leaveService = module.get<LeaveRequestsService>(LeaveRequestsService);
    leaveRequestRepository = module.get<Repository<LeaveRequest>>(
      getRepositoryToken(LeaveRequest),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    leavePoliciesService =
      module.get<LeavePoliciesService>(LeavePoliciesService);
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
    startDate: '2020-02-21',
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

  it('should calculate leave days', () => {
    const days = leaveService.calculateLeaveDays('2025-02-01', '2025-02-05');
    expect(days).toBe(4);
  });

  it('should create leave request', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    // 🔹 Mock para evitar erro no método getEmployeeLeaves()
    jest.spyOn(leaveRequestRepository, 'find').mockResolvedValue([]);

    // 🔹 Mock explícito para leavePoliciesService.getPolicy()
    jest.spyOn(leavePoliciesService, 'getPolicy').mockReturnValue({
      annualLeaveDays: 20,
    });

    jest
      .spyOn(leaveRequestRepository, 'create')
      .mockReturnValue(leaveRequest as any);
    jest.spyOn(leaveRequestRepository, 'save').mockResolvedValue(leaveRequest);

    const result = await leaveService.requestLeave(user.id, leaveDto);

    expect(result).toEqual(leaveRequest);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(leaveRequestRepository.create).toHaveBeenCalledWith({
      ...leaveDto,
      employee: user,
    });
    expect(leaveRequestRepository.save).toHaveBeenCalledWith(leaveRequest);
  });

  it('employees leaves', async () => {
    jest
      .spyOn(leaveRequestRepository, 'find')
      .mockResolvedValue([leaveRequest]);

    const result = await leaveService.getEmployeeLeaves(user.id);
    expect(result).toEqual([leaveRequest]);
    expect(leaveRequestRepository.find).toHaveBeenCalledWith({
      relations: ['employee'],
      where: { employee: { id: user.id } },
    });
  });
  it('should approve leave request', async () => {
    const approvedLeaveRequest: LeaveRequest = {
      ...leaveRequest,
      status: 'approved',
    };

    jest.spyOn(leaveRequestRepository, 'update').mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });
    jest
      .spyOn(leaveRequestRepository, 'findOne')
      .mockResolvedValue(approvedLeaveRequest);

    const result = await leaveService.approveLeave(leaveRequest.id);

    expect(result).toEqual(approvedLeaveRequest);
    expect(leaveRequestRepository.update).toHaveBeenCalledWith(
      leaveRequest.id,
      { status: 'Approved' },
    );
    expect(leaveRequestRepository.findOne).toHaveBeenCalledWith({
      where: { id: leaveRequest.id },
    });
  });

  it('should reject leave request', async () => {
    const rejectedLeaveRequest: LeaveRequest = {
      ...leaveRequest,
      status: 'rejected',
    };

    jest.spyOn(leaveRequestRepository, 'update').mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });
    jest
      .spyOn(leaveRequestRepository, 'findOne')
      .mockResolvedValue(rejectedLeaveRequest);

    const result = await leaveService.rejectLeave(leaveRequest.id);

    expect(result).toEqual(rejectedLeaveRequest);
    expect(leaveRequestRepository.update).toHaveBeenCalledWith(
      leaveRequest.id,
      { status: 'Rejected' },
    );
    expect(leaveRequestRepository.findOne).toHaveBeenCalledWith({
      where: { id: leaveRequest.id },
    });
  });
});
