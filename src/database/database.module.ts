// This module sets up the database connection using TypeORM and PostgreSQL.
// It uses the ConfigService to load database configuration from environment variables.
// The connection settings include host, port, username, password, database name, and synchronization option.
// The module imports the TypeOrmModule and ConfigModule to manage the database connection and configuration.
// The TypeOrmModule is configured asynchronously using the ConfigService to ensure that the configuration is loaded before establishing the connection.
// The database connection is established using the PostgreSQL driver, and the entities are loaded from the specified directory.
// The synchronize option is set to true for development purposes, allowing automatic synchronization of the database schema with the entities.
// This module is essential for setting up the database connection in a NestJS application using TypeORM and PostgreSQL.


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'interview_calendar'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNC', true),
      }),
    }),
  ],
})
export class DatabaseModule {}