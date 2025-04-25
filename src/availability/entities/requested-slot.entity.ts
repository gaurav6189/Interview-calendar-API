import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class RequestedSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @ManyToOne(() => User, (user) => user.requestedSlots)
  @JoinColumn({ name: 'candidate_id' })
  candidate: User;

  @Column({ name: 'candidate_id' })
  candidateId: string;
}