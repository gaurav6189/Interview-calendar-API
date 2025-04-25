import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InterviewSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column('uuid', { array: true })
  interviewerIds: string[];

  @Column('uuid')
  candidateId: string;
}