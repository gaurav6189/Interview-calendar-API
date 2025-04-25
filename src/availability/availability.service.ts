import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailabilitySlot } from './entities/availability-slot.entity';
import { RequestedSlot } from './entities/requested-slot.entity';
import { CreateAvailabilitySlotDto } from './dto/create-availability-slot.dto';
import { CreateRequestedSlotDto } from './dto/create-requested-slot.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilitySlot)
    private readonly availabilitySlotRepository: Repository<AvailabilitySlot>,
    @InjectRepository(RequestedSlot)
    private readonly requestedSlotRepository: Repository<RequestedSlot>,
    private readonly usersService: UsersService,
  ) {}

  async createAvailabilitySlot(dto: CreateAvailabilitySlotDto): Promise<AvailabilitySlot> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // Validate time slot constraints
    this.validateTimeSlot(startTime, endTime);

    // Check if the user is an interviewer
    const interviewer = await this.usersService.findOne(dto.interviewerId);
    if (interviewer.role !== UserRole.INTERVIEWER) {
      throw new BadRequestException('Only interviewers can set availability slots');
    }

    const slot = this.availabilitySlotRepository.create({
      startTime,
      endTime,
      interviewerId: dto.interviewerId,
    });

    return this.availabilitySlotRepository.save(slot);
  }

  async createRequestedSlot(dto: CreateRequestedSlotDto): Promise<RequestedSlot> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // Validate time slot constraints
    this.validateTimeSlot(startTime, endTime);

    // Check if the user is a candidate
    const candidate = await this.usersService.findOne(dto.candidateId);
    if (candidate.role !== UserRole.CANDIDATE) {
      throw new BadRequestException('Only candidates can set requested slots');
    }

    const slot = this.requestedSlotRepository.create({
      startTime,
      endTime,
      candidateId: dto.candidateId,
    });

    return this.requestedSlotRepository.save(slot);
  }

  async getAvailabilitySlotsForInterviewer(interviewerId: string): Promise<AvailabilitySlot[]> {
    // Verify interviewer exists
    await this.usersService.findOne(interviewerId);
    
    return this.availabilitySlotRepository.find({
      where: { interviewerId },
      order: { startTime: 'ASC' },
    });
  }

  async getRequestedSlotsForCandidate(candidateId: string): Promise<RequestedSlot[]> {
    // Verify candidate exists
    await this.usersService.findOne(candidateId);
    
    return this.requestedSlotRepository.find({
      where: { candidateId },
      order: { startTime: 'ASC' },
    });
  }

  async removeAvailabilitySlot(id: string): Promise<void> {
    const slot = await this.availabilitySlotRepository.findOne({ where: { id } });
    if (!slot) {
      throw new NotFoundException(`Availability slot with ID "${id}" not found`);
    }
    await this.availabilitySlotRepository.remove(slot);
  }

  async removeRequestedSlot(id: string): Promise<void> {
    const slot = await this.requestedSlotRepository.findOne({ where: { id } });
    if (!slot) {
      throw new NotFoundException(`Requested slot with ID "${id}" not found`);
    }
    await this.requestedSlotRepository.remove(slot);
  }

  private validateTimeSlot(startTime: Date, endTime: Date): void {
    // Ensure start time is before end time
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Ensure the slot is exactly 1 hour
    const diffInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (diffInHours !== 1) {
      throw new BadRequestException('Time slot must be exactly 1 hour');
    }

    // Ensure the slot starts at the beginning of an hour
    if (startTime.getMinutes() !== 0 || startTime.getSeconds() !== 0) {
      throw new BadRequestException('Time slot must start at the beginning of an hour');
    }
  }
}