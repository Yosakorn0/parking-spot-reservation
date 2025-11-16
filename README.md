# Parking Spot Reservation

A Next.js application for managing parking spot reservations with Google OAuth authentication.

## Quick Start

### Database Setup (Docker)

Start the database services:
```bash
cd db
docker-compose up -d
```

Or from the root directory:
```bash
docker-compose -f db/docker-compose.yml up -d
```

### Application Development

#### Option 1: Local Development (Recommended)
```bash
npm install
npm run dev
```

#### Option 2: Docker Development
```bash
cd deploy
docker-compose -f docker-compose.dev.yml up
```

#### Option 3: Docker Production
```bash
cd deploy
docker-compose up -d
```

## Project Structure

```
.
├── db/                    # Database services (PostgreSQL, pgAdmin)
│   └── docker-compose.yml
├── deploy/                # Application deployment
│   ├── Dockerfile         # Production Dockerfile
│   ├── Dockerfile.dev     # Development Dockerfile
│   ├── docker-compose.yml # Production compose
│   └── docker-compose.dev.yml # Development compose
├── src/                   # Application source code
└── docker-compose.yml     # Root compose (database only)
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:mypassword123@localhost:15432/parking-spot-reservation
AUTH_SECRET=your-auth-secret-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
```

## Database Access

- **PostgreSQL**: `localhost:15432`
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `password`
  - Server connection:
    - Host: `postgres`
    - Port: `5432`
    - Username: `postgres`
    - Password: `mypassword123`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio
- `cd db && docker-compose up` - Start database services
- `cd deploy && docker-compose up` - Start app in Docker

## Docker Commands

### Database Services
```bash
# Start database
cd db && docker-compose up -d

# Stop database
cd db && docker-compose down

# View logs
cd db && docker-compose logs -f
```

### Application Services
```bash
# Development mode
cd deploy && docker-compose -f docker-compose.dev.yml up

# Production mode
cd deploy && docker-compose up -d

# Stop application
cd deploy && docker-compose down
```
