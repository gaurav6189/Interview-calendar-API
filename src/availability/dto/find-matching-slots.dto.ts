import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class FindMatchingSlotsDto {
  @IsNotEmpty()
  @IsUUID()
  candidateId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  interviewerIds: string[];
}