import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UsersService } from '../../users/users.service';
import { AvailabilityService } from '../../availability/availability.service';
import { UserRole } from '../../users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);
  const availabilityService = app.get(AvailabilityService);

  // Create interviewers
  const interviewer1 = await usersService.create({
    name: 'Ines',
    email: 'ines@example.com',
    role: UserRole.INTERVIEWER,
  });

  const interviewer2 = await usersService.create({
    name: 'Ingrid',
    email: 'ingrid@example.com',
    role: UserRole.INTERVIEWER,
  });

  // Create candidate
  const candidate = await usersService.create({
    name: 'Carl',
    email: 'carl@example.com',
    role: UserRole.CANDIDATE,
  });

  // Get next week's dates
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7);
  
  // Set availability for Ines: next week each day from 9am through 4pm
  for (let i = 0; i < 5; i++) { // Monday to Friday
    const dayDate = new Date(nextMonday);
    dayDate.setDate(nextMonday.getDate() + i);
    
    // 9am to 4pm (7 slots)
    for (let hour = 9; hour < 16; hour++) {
      const startTime = new Date(dayDate);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      await availabilityService.createAvailabilitySlot({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        interviewerId: interviewer1.id,
      });
    }
  }

  // Set availability for Ingrid: 12pm to 6pm on Monday and Wednesday
  // Monday
  for (let hour = 12; hour < 18; hour++) {
    const startTime = new Date(nextMonday);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    await availabilityService.createAvailabilitySlot({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interviewerId: interviewer2.id,
    });
  }

  // Wednesday
  const nextWednesday = new Date(nextMonday);
  nextWednesday.setDate(nextMonday.getDate() + 2);
  
  for (let hour = 12; hour < 18; hour++) {
    const startTime = new Date(nextWednesday);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    await availabilityService.createAvailabilitySlot({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interviewerId: interviewer2.id,
    });
  }

  // Tuesday and Thursday for Ingrid: 9am to 12pm
  const nextTuesday = new Date(nextMonday);
  nextTuesday.setDate(nextMonday.getDate() + 1);
  
  const nextThursday = new Date(nextMonday);
  nextThursday.setDate(nextMonday.getDate() + 3);
  
  for (const day of [nextTuesday, nextThursday]) {
    for (let hour = 9; hour < 12; hour++) {
      const startTime = new Date(day);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      await availabilityService.createAvailabilitySlot({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        interviewerId: interviewer2.id,
      });
    }
  }

  // Set requested slots for Carl: 9am to 10am any weekday next week
  for (let i = 0; i < 5; i++) { // Monday to Friday
    const dayDate = new Date(nextMonday);
    dayDate.setDate(nextMonday.getDate() + i);
    
    const startTime = new Date(dayDate);
    startTime.setHours(9, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    await availabilityService.createRequestedSlot({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      candidateId: candidate.id,
    });
  }

  // 10am to 12pm on Wednesday
  for (let hour = 10; hour < 12; hour++) {
    const startTime = new Date(nextWednesday);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    await availabilityService.createRequestedSlot({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      candidateId: candidate.id,
    });
  }

  console.log('Seeding completed successfully!');
  await app.close();
}

bootstrap();