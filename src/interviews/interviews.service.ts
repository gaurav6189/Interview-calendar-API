import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { InterviewSlot } from './entities/interview-slot.entity';
import { AvailabilitySlot } from '../availability/entities/availability-slot.entity';
import { RequestedSlot } from '../availability/entities/requested-slot.entity';
import { FindMatchingSlotsDto } from '../availability/dto/find-matching-slots.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

// interface TimeSlot {
//   startTime: Date;
//   endTime: Date;
// }
export class TimeSlot {
    @ApiProperty({ type: String, example: '2025-04-23T10:00:00Z' })
    startTime: Date;
  
    @ApiProperty({ type: String, example: '2025-04-23T11:00:00Z' })
    endTime: Date;
  }
@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(InterviewSlot)
    private readonly interviewSlotRepository: Repository<InterviewSlot>,
    @InjectRepository(AvailabilitySlot)
    private readonly availabilitySlotRepository: Repository<AvailabilitySlot>,
    @InjectRepository(RequestedSlot)
    private readonly requestedSlotRepository: Repository<RequestedSlot>,
    private readonly usersService: UsersService,
  ) {}

  async findMatchingSlots(dto: FindMatchingSlotsDto): Promise<TimeSlot[]> {
    // Verify users exist and have correct roles
    const candidate = await this.usersService.findOne(dto.candidateId);
    if (candidate.role !== UserRole.CANDIDATE) {
      throw new NotFoundException(`User with ID "${dto.candidateId}" is not a candidate`);
    }

    for (const interviewerId of dto.interviewerIds) {
      const interviewer = await this.usersService.findOne(interviewerId);
      if (interviewer.role !== UserRole.INTERVIEWER) {
        throw new NotFoundException(`User with ID "${interviewerId}" is not an interviewer`);
      }
    }

    // Get candidate requested slots
    const candidateSlots = await this.requestedSlotRepository.find({
      where: { candidateId: dto.candidateId },
      order: { startTime: 'ASC' },
    });

    if (candidateSlots.length === 0) {
      return [];
    }

    // Get all interviewer availability slots
    const interviewerSlots = await this.availabilitySlotRepository.find({
      where: { interviewerId: In(dto.interviewerIds) },
      order: { startTime: 'ASC' },
    });

    if (interviewerSlots.length === 0) {
      return [];
    }

    // Group interviewer slots by interviewer
    const interviewerSlotsMap = new Map<string, AvailabilitySlot[]>();
    interviewerSlots.forEach(slot => {
      if (!interviewerSlotsMap.has(slot.interviewerId)) {
        interviewerSlotsMap.set(slot.interviewerId, []);
      }
      (interviewerSlotsMap.get(slot.interviewerId) ?? []).push(slot);
    });

    // Find common slots
    const candidateTimeSlots = this.convertToTimeSlots(candidateSlots);
    const commonSlots: TimeSlot[] = [];

    // For each candidate slot, check if all interviewers are available
    candidateTimeSlots.forEach(candidateSlot => {
      let allInterviewersAvailable = true;

      // Check if all interviewers are available for this slot
      for (const interviewerId of dto.interviewerIds) {
        const interviewer = interviewerSlotsMap.get(interviewerId) || [];
        const isAvailable = interviewer.some(slot => 
          this.isOverlapping(candidateSlot, { startTime: slot.startTime, endTime: slot.endTime })
        );

        if (!isAvailable) {
          allInterviewersAvailable = false;
          break;
        }
      }

      if (allInterviewersAvailable) {
        commonSlots.push(candidateSlot);
      }
    });

    return commonSlots;
  }

  private convertToTimeSlots(slots: (AvailabilitySlot | RequestedSlot)[]): TimeSlot[] {
    return slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));
  }

  private isOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
    // Convert to timestamp for easier comparison
    const start1 = slot1.startTime.getTime();
    const end1 = slot1.endTime.getTime();
    const start2 = slot2.startTime.getTime();
    const end2 = slot2.endTime.getTime();

    // Check if slots overlap
    return start1 < end2 && start2 < end1;
  }
}