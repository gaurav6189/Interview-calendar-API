import { Controller, Post, Body } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { FindMatchingSlotsDto } from '../availability/dto/find-matching-slots.dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('matching-slots')
  findMatchingSlots(@Body() findMatchingSlotsDto: FindMatchingSlotsDto) {
    return this.interviewsService.findMatchingSlots(findMatchingSlotsDto);
 
  }
}