import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { InterviewSlot } from '../interviews/entities/interview-slot.entity';
import { AvailabilitySlot } from '../availability/entities/availability-slot.entity';
import { RequestedSlot } from '../availability/entities/requested-slot.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewSlot, AvailabilitySlot, RequestedSlot]),
    UsersModule,
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}