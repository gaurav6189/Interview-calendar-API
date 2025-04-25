import { Controller, Get, Post, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilitySlotDto } from './dto/create-availability-slot.dto';
import { CreateRequestedSlotDto } from './dto/create-requested-slot.dto';
import { AvailabilitySlot } from './entities/availability-slot.entity';
import { RequestedSlot } from './entities/requested-slot.entity';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post('interviewer')
  createAvailabilitySlot(@Body() createSlotDto: CreateAvailabilitySlotDto): Promise<AvailabilitySlot> {
    return this.availabilityService.createAvailabilitySlot(createSlotDto);
  }

  @Post('candidate')
  createRequestedSlot(@Body() createSlotDto: CreateRequestedSlotDto): Promise<RequestedSlot> {
    return this.availabilityService.createRequestedSlot(createSlotDto);
  }

  @Get('interviewer/:id')
  getInterviewerSlots(@Param('id') id: string): Promise<AvailabilitySlot[]> {
    return this.availabilityService.getAvailabilitySlotsForInterviewer(id);
  }

  @Get('candidate/:id')
  getCandidateSlots(@Param('id') id: string): Promise<RequestedSlot[]> {
    return this.availabilityService.getRequestedSlotsForCandidate(id);
  }

  @Delete('interviewer/:id')
  @HttpCode(204)
  removeAvailabilitySlot(@Param('id') id: string): Promise<void> {
    return this.availabilityService.removeAvailabilitySlot(id);
  }

  @Delete('candidate/:id')
  @HttpCode(204)
  removeRequestedSlot(@Param('id') id: string): Promise<void> {
    return this.availabilityService.removeRequestedSlot(id);
  }
}