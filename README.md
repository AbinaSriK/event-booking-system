# Event Booking System

A full-stack Event Booking System built with **Spring Boot, PostgreSQL, Next.js, and Docker**. The application provides event management, user authentication, role-based access, event booking, and an automated testing and CI/CD pipeline using GitHub Actions.

## Features

### User Features
- User registration and login
- JWT-based authentication
- Browse available events
- View event details
- Book seats for events
- View personal bookings
- Role-based access control

### Admin Features
- Admin dashboard
- Create events
- Update events
- Delete events
- View and manage events
- View registered users
- Manage user roles

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- Spring Security
- JWT Authentication
- BCrypt Password Encryption
- PostgreSQL
- REST APIs
- Maven
- Swagger / OpenAPI

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- TanStack React Query
- Axios

### Testing
- JUnit 5
- Mockito
- MockMvc
- Testcontainers
- PostgreSQL Testcontainers
- Jest
- React Testing Library
- JaCoCo

### DevOps / CI/CD
- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)
- GitHub Branch Protection

## Project Structure

```text
event-booking-system/
│
├── event-backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── Dockerfile
│   ├── pom.xml
│   └── mvnw
│
├── event-frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Backend API

The backend provides REST APIs for:

- Authentication
- Users
- Events
- Bookings
- Admin operations

The backend runs on:

```text
http://localhost:8080
```

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Frontend

The Next.js frontend runs on:

```text
http://localhost:3000
```

The frontend communicates with the Spring Boot backend through REST APIs.

## Running the Project Locally

### Prerequisites

Install:

- Java 21
- Node.js 22
- PostgreSQL
- Maven
- Docker Desktop
- Git

### Backend

Navigate to the backend:

```bash
cd event-backend
```

Run the application:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

### Frontend

Navigate to the frontend:

```bash
cd event-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will start on:

```text
http://localhost:3000
```

## Running with Docker

The project includes Dockerfiles for both the backend and frontend, along with a Docker Compose configuration containing:

- PostgreSQL
- Spring Boot backend
- Next.js frontend

From the project root, run:

```bash
docker compose up --build
```

The application will be available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080
```

To stop the containers:

```bash
docker compose down
```

The PostgreSQL database uses a persistent Docker volume so that database data is retained when containers are stopped and restarted.

## Testing

### Backend Tests

The backend includes:

- Service unit tests using JUnit 5 and Mockito
- Controller tests using MockMvc
- Integration tests using Testcontainers with PostgreSQL
- Application context testing
- JaCoCo code coverage

Run all backend tests:

```powershell
cd event-backend
.\mvnw.cmd clean test
```

The project currently has:

```text
79 tests
79 passed
0 failures
0 errors
```

### Frontend Tests

The frontend uses Jest and React Testing Library.

Run the tests:

```bash
cd event-frontend
npm test -- --ci
```

Current test result:

```text
28 tests
28 passed
```

### Frontend Lint

Run:

```bash
npm run lint
```

### Frontend Production Build

Run:

```bash
npm run build
```

## Code Coverage

JaCoCo is configured for backend code coverage.

The project achieves more than the required **70% service-layer coverage**.

The JaCoCo report can be generated with:

```powershell
.\mvnw.cmd clean test
```

The report is generated under:

```text
event-backend/target/site/jacoco/
```

## CI/CD Pipeline

GitHub Actions is used to automatically validate the project.

The pipeline runs on:

- Every push
- Every pull request

### Pipeline Stages

#### Backend Tests

The pipeline:

- Sets up Java 21
- Runs Maven verification
- Executes unit tests
- Executes controller tests
- Executes integration tests
- Runs Testcontainers tests

#### Frontend Tests

The pipeline:

- Sets up Node.js 22
- Installs dependencies
- Runs ESLint
- Runs Jest tests
- Creates the production build

#### Docker Build

The pipeline builds:

- Backend Docker image
- Frontend Docker image

#### Docker Publishing

When changes are pushed to the `main` branch, the Docker images are published to **GitHub Container Registry (GHCR)**.

## GitHub Branch Protection

The `main` branch is protected.

The following requirements are enabled:

- Pull request required before merging
- Backend Tests must pass
- Frontend Tests must pass
- Build Docker Images must pass

This prevents changes from being merged into `main` unless the required CI checks pass.

## Docker Images

The CI/CD pipeline publishes the application images to GitHub Container Registry.

```text
ghcr.io/abinasrik/event-booking-backend:latest
ghcr.io/abinasrik/event-booking-frontend:latest
```

## Environment Configuration

Environment-specific values are stored using environment variables.

Example:

```env
POSTGRES_DB=event_booking_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

BACKEND_PORT=8080
FRONTEND_PORT=3000

NEXT_PUBLIC_API_URL=http://localhost:8080
JWT_SECRET=your-secret-key
```

Sensitive environment files such as `.env` are excluded from Git using `.gitignore`.

## CI/CD Workflow

```text
Developer
    │
    ▼
Push / Pull Request
    │
    ▼
GitHub Actions
    │
    ├── Backend Tests
    │
    ├── Frontend Tests
    │
    ├── Frontend Lint
    │
    ├── Frontend Build
    │
    └── Docker Image Build
            │
            ▼
       All Checks Pass
            │
            ▼
       Merge to main
            │
            ▼
     Publish Docker Images
            │
            ▼
          GHCR
```

## Repository

GitHub Repository:

https://github.com/AbinaSriK/event-booking-system

## CI/CD Status

The GitHub Actions pipeline has been successfully configured and tested.

The pipeline validates:

- Backend tests
- Frontend tests
- Frontend lint
- Frontend production build
- Docker image builds
- Docker image publishing

All required CI checks must pass before changes can be merged into the protected `main` branch.

## Project Status

**Completed**

The Event Booking System includes the complete application, automated testing, Docker containerization, GitHub Actions CI/CD, Docker image publishing, and protected main branch workflow.