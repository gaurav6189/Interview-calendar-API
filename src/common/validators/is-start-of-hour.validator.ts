import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStartOfHour(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStartOfHour',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          try {
            const date = new Date(value);
            return date.getMinutes() === 0 && date.getSeconds() === 0;
          } catch (e) {
            return false;
          }
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at the start of an hour (minutes and seconds should be 0)`;
        },
      },
    });
  };
}