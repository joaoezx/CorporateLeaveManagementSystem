import { Test, TestingModule } from '@nestjs/testing';
import { LeavePoliciesService } from './leave-policies.service';
import { LeavePolicy } from './schema/leave-policy.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('LeavePoliciesService', () => {
  let service: LeavePoliciesService;
  let model: Model<LeavePolicy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeavePoliciesService,
        {
          provide: getModelToken(LeavePolicy.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeavePoliciesService>(LeavePoliciesService);
    model = module.get<Model<LeavePolicy>>(getModelToken(LeavePolicy.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPolicy', () => {
    it('should return a policy from the database', async () => {
      const mockPolicy = {
        annualLeaveDays: 20,
        sickLeaveDays: 5,
      };

      // Simulamos o comportamento do `exec()`
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPolicy),
      } as any);

      const result = await service.getPolicy();
      expect(result).toEqual(mockPolicy);
      expect(model.findOne).toHaveBeenCalled();
    });

    it('should create and return a default policy if none exists', async () => {
      const mockNewPolicy = {
        annualLeaveDays: 20,
        sickLeaveDays: 5,
      };

      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // Nenhuma política encontrada
      } as any);

      jest.spyOn(model, 'create').mockResolvedValue(mockNewPolicy as any); // Corrige a criação

      const result = await service.getPolicy();

      expect(result).toEqual(mockNewPolicy);
      expect(model.findOne).toHaveBeenCalled();
      expect(model.create).toHaveBeenCalledWith({
        annualLeaveDays: 20,
        sickLeaveDays: 5,
      });
    });
  });
});
