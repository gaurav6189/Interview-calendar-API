Interview Calendar API
A NestJS application using TypeORM and PostgreSQL for scheduling interviews between candidates and interviewers.
Features

Create and manage users (candidates and interviewers)
Set availability slots for interviewers
Set requested slots for candidates
Find matching slots between candidates and interviewers

Prerequisites

Node.js (v20 or higher)
PostgreSQL
Docker and Docker Compose (optional)

Installation and Setup
Option 1: Local Development

Clone the repository
git clone <repository-url>
cd interview-calendar-api

Install dependencies
npm install

Create a .env file in the root directory with the following content:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interview_calendar
DB_SYNC=true
PORT=3000

Make sure PostgreSQL is running and create the database:
createdb interview_calendar

Start the application:
npm run start:dev

Seed dummy data to db using below comand, it will add data for 2 interviewers Ines and Ingrid and 1 candidate Carl
npm run seed

Option 2: Using Docker

Clone the repository
git clone <repository-url>
cd interview-calendar-api

Build and start the containers:
docker-compose up -d 
docker-compose up --build

seed dummy data to db using below comand it will add data for 2 interviewers Ines and Ingrid and 1 candidate Carl

docker exec -it interview-calendar-api-app-1 npm run seed
Where interview-calendar-api-app-1 is the name of your NestJS container.


The API will be available at http://localhost:3000.
API Documentation
Once the application is running, visit http://localhost:3000/api to access the Swagger documentation.
API Endpoints
Users

POST /users - Create a user (candidate or interviewer)
GET /users - Get all users
GET /users/:id - Get a specific user
PUT /users/:id - Update a user
DELETE /users/:id - Delete a user

Availability

POST /availability/interviewer - Create an availability slot for an interviewer
POST /availability/candidate - Create a requested slot for a candidate
GET /availability/interviewer/:id - Get availability slots for an interviewer
GET /availability/candidate/:id - Get requested slots for a candidate
DELETE /availability/interviewer/:id - Delete an interviewer's availability slot
DELETE /availability/candidate/:id - Delete a candidate's requested slot

Interviews

POST /interviews/matching-slots - Find matching slots between a candidate and interviewers

Rules and Constraints

An interview slot is a 1-hour period of time that spreads from the beginning of any hour until the beginning of the next hour.
Interviewers set their availability slots.
Candidates set their requested slots.
The API finds common slots where interviews can be scheduled.

Running Tests
npm run test
To run tests with coverage:
npm run test:cov
Implementation Notes

The application is built with NestJS, TypeORM, and PostgreSQL.
All time slots must start at the beginning of an hour and last exactly one hour.
The API validates inputs to ensure they meet the requirements.
Exception filters provide consistent error responses.
Swagger documentation makes the API easy to explore.
</artifact>


19. Additional Scripts in package.json
Let's enhance our package.json with additional scripts:
<artifact>
<antArtifact identifier="package-json" title="package.json" type="application/vnd.ant.code" language="json">
{
  "name": "interview-calendar-api",
  "version": "0.0.1",
  "description": "Interview Calendar API for scheduling interviews",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "typeorm:migration:create": "npm run typeorm -- migration:create -n",
    "typeorm:migration:generate": "npm run typeorm -- migration:generate -n",
    "typeorm:migration:run": "npm run typeorm -- migration:run",
    "typeorm:migration:revert": "npm run typeorm -- migration:revert",
    "db:seed": "ts-node -r tsconfig-paths/register src/database/seeds/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/mapped-types": "^2.0.2",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "pg": "^8.11.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.0",
    "typeorm": "^0.3.15"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^5.59.11",
    "@typescript-eslint/parser": "^5.59.11",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "jest": "^29.5.0",
    "prettier": "^2.8.8",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}