// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AvailabilitySlot } from '../../availability/entities/availability-slot.entity';
import { RequestedSlot } from '../../availability/entities/requested-slot.entity';

export enum UserRole {
  INTERVIEWER = 'interviewer',
  CANDIDATE = 'candidate',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @OneToMany(() => AvailabilitySlot, (slot) => slot.interviewer)
  availabilitySlots: AvailabilitySlot[];

  @OneToMany(() => RequestedSlot, (slot) => slot.candidate)
  requestedSlots: RequestedSlot[];
}