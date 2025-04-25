import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @ManyToOne(() => User, (user) => user.availabilitySlots)
  @JoinColumn({ name: 'interviewer_id' })
  interviewer: User;

  @Column({ name: 'interviewer_id' })
  interviewerId: string;
}