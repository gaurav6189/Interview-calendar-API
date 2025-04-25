import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { IsStartOfHour } from '../../common/validators/is-start-of-hour.validator';

export class CreateRequestedSlotDto {
  @IsNotEmpty()
  @IsDateString()
  @IsStartOfHour()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @IsUUID()
  candidateId: string;
}