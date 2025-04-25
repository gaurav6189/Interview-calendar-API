import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewsService } from './interviews.service';
import { InterviewSlot } from './entities/interview-slot.entity';
import { AvailabilitySlot } from '../availability/entities/availability-slot.entity';
import { RequestedSlot } from '../availability/entities/requested-slot.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let mockInterviewSlotRepo: jest.Mocked<Repository<InterviewSlot>>;
  let mockAvailabilitySlotRepo: jest.Mocked<Repository<AvailabilitySlot>>;
  let mockRequestedSlotRepo: jest.Mocked<Repository<RequestedSlot>>;
  let mockUsersService: jest.Mocked<UsersService>;

  // Helper function to create mock users
  const createMockUser = (id: string, role: UserRole) => ({
    id,
    role,
    name: `Test ${role === UserRole.CANDIDATE ? 'Candidate' : 'Interviewer'}`,
    email: `${id}@example.com`,
    availabilitySlots: [],
    requestedSlots: [],
  });

  beforeEach(async () => {
    const mockRepos = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    mockUsersService = {
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
        {
          provide: getRepositoryToken(InterviewSlot),
          useValue: { ...mockRepos },
        },
        {
          provide: getRepositoryToken(AvailabilitySlot),
          useValue: { ...mockRepos },
        },
        {
          provide: getRepositoryToken(RequestedSlot),
          useValue: { ...mockRepos },
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<InterviewsService>(InterviewsService);
    mockInterviewSlotRepo = module.get(getRepositoryToken(InterviewSlot)) as any;
    mockAvailabilitySlotRepo = module.get(getRepositoryToken(AvailabilitySlot)) as any;
    mockRequestedSlotRepo = module.get(getRepositoryToken(RequestedSlot)) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMatchingSlots', () => {
    it('should return matching slots when candidate and interviewers have overlapping slots', async () => {
      // Mock user service to return proper users
      mockUsersService.findOne.mockImplementation(async (id: string) => {
        if (id === 'candidate-id') {
          return createMockUser('candidate-id', UserRole.CANDIDATE);
        } else {
          return createMockUser(id, UserRole.INTERVIEWER);
        }
      });

      // Mock candidate slots
      mockRequestedSlotRepo.find.mockResolvedValue([
        {
          id: '1',
          candidateId: 'candidate-id',
          startTime: new Date('2023-05-01T09:00:00Z'),
          endTime: new Date('2023-05-01T10:00:00Z'),
          candidate: createMockUser('candidate-id', UserRole.CANDIDATE)
        },
        {
          id: '2',
          candidateId: 'candidate-id',
          startTime: new Date('2023-05-01T10:00:00Z'),
          endTime: new Date('2023-05-01T11:00:00Z'),
          candidate: createMockUser('candidate-id', UserRole.CANDIDATE)
        }
      ]);

      // Mock interviewer slots
      mockAvailabilitySlotRepo.find.mockResolvedValue([
        {
          id: '3',
          interviewerId: 'interviewer-1',
          startTime: new Date('2023-05-01T09:00:00Z'),
          endTime: new Date('2023-05-01T10:00:00Z'),
          interviewer: createMockUser('interviewer-1', UserRole.INTERVIEWER)
        },
        {
          id: '4',
          interviewerId: 'interviewer-1',
          startTime: new Date('2023-05-01T10:00:00Z'),
          endTime: new Date('2023-05-01T11:00:00Z'),
          interviewer: createMockUser('interviewer-1', UserRole.INTERVIEWER)
        },
        {
          id: '5',
          interviewerId: 'interviewer-2',
          startTime: new Date('2023-05-01T09:00:00Z'),
          endTime: new Date('2023-05-01T10:00:00Z'),
          interviewer: createMockUser('interviewer-2', UserRole.INTERVIEWER)
        }
      ]);

      const result = await service.findMatchingSlots({
        candidateId: 'candidate-id',
        interviewerIds: ['interviewer-1', 'interviewer-2']
      });

      expect(result).toEqual([
        {
          startTime: new Date('2023-05-01T09:00:00Z'),
          endTime: new Date('2023-05-01T10:00:00Z')
        }
      ]);
    });
  });
});