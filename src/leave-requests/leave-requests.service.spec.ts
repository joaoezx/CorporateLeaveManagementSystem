import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LeaveRequestsService } from './leave-requests.service';
import { LeavePoliciesService } from '../leave-policies/leave-policies.service';
import { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';
import { LeaveRequest } from './schema/leave-request.entity';

describe('LeaveRequestsService', () => {
  let service: LeaveRequestsService;
  let leaveModel: Model<LeaveRequest>;
  let userModel: Model<User>;
  let leavePoliciesService: LeavePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaveRequestsService,
        {
          provide: getModelToken(LeaveRequest.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
        {
          provide: LeavePoliciesService,
          useValue: {
            getPolicy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeaveRequestsService>(LeaveRequestsService);
    leaveModel = module.get<Model<LeaveRequest>>(
      getModelToken(LeaveRequest.name),
    );
    userModel = module.get<Model<User>>(getModelToken(User.name));
    leavePoliciesService =
      module.get<LeavePoliciesService>(LeavePoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestLeave', () => {
    it('should create a leave request', async () => {
      const userId = 'user123';
      const leaveDto = {
        startDate: '2025-03-10',
        endDate: '2025-03-15',
        leaveType: 'Annual',
      };

      const mockUser = { _id: userId };
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      jest.spyOn(leavePoliciesService, 'getPolicy').mockResolvedValue({
        _id: 'mock-policy-id',
        annualLeaveDays: 20,
      } as any);

      jest.spyOn(service, 'calculateUsedLeaveDays').mockResolvedValue(5);

      jest.spyOn(leaveModel, 'create').mockResolvedValue({
        _id: 'leave123',
        ...leaveDto,
        employee: userId,
      } as any);

      const result = await service.requestLeave(userId, leaveDto);

      expect(result).toEqual({
        _id: 'leave123',
        ...leaveDto,
        employee: userId,
      });
    });
  });
});
