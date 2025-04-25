export class DateTimeUtils {
    /**
     * Checks if a given date starts at the beginning of an hour (minutes and seconds are 0)
     */
    static isStartOfHour(date: Date): boolean {
      return date.getMinutes() === 0 && date.getSeconds() === 0;
    }
  
    /**
     * Checks if two time slots are exactly one hour apart
     */
    static isOneHourSlot(startTime: Date, endTime: Date): boolean {
      const diffInMs = endTime.getTime() - startTime.getTime();
      const oneHourInMs = 60 * 60 * 1000;
      return diffInMs === oneHourInMs;
    }
  
    /**
     * Generates all possible one-hour time slots between startDate and endDate
     * Each slot starts at the beginning of an hour
     */
    static generateOneHourSlots(startDate: Date, endDate: Date): Array<{ startTime: Date; endTime: Date }> {
      const slots: Array<{ startTime: Date; endTime: Date }> = [];
      const currentDate = new Date(startDate);
      
      // Ensure we start at the beginning of an hour
      currentDate.setMinutes(0, 0, 0);
      
      while (currentDate < endDate) {
        const startTime = new Date(currentDate);
        const endTime = new Date(currentDate);
        endTime.setHours(endTime.getHours() + 1);
        
        if (endTime <= endDate) {
          slots.push({ startTime, endTime });
        }
        
        currentDate.setHours(currentDate.getHours() + 1);
      }
      
      return slots;
    }
  
    /**
     * Format date in ISO format without milliseconds
     */
    static formatDate(date: Date): string {
      return date.toISOString().split('.')[0] + 'Z';
    }
  }