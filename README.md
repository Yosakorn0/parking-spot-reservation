# Parking Spot Reservation System | Booking Platform with Google Authentication

A modern, full-stack **parking reservation system** and **booking platform** built with Next.js, featuring secure **Google OAuth authentication**. This application enables users to reserve parking spots with an intuitive interface, real-time availability tracking, and seamless authentication via Google Sign-In.

## 📖 Project Information

This project is developed as a **capstone project** for **King Mongkut's Institute of Technology Ladkrabang (KMITL)**.

**Author & Implementer**: Yosakorn Sirisoot

## 🚗 Features

- **Parking Spot Reservation**: Easy-to-use booking system for parking spots with date and time selection
- **Google OAuth Authentication**: Secure login and user management using Google Sign-In
- **Real-time Availability**: Check parking spot availability in real-time
- **User Dashboard**: Personal reservation management dashboard
- **RESTful API**: Complete REST API for reservation management
- **PostgreSQL Database**: Robust data storage with Drizzle ORM
- **Docker Support**: Full containerization for easy deployment
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui

## 🚀 Quick Start

Get your parking reservation system up and running in minutes with Google OAuth authentication.

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

#### Option 2: Docker Development (Default)
```bash
cd deploy
docker-compose up --build
```
This starts the app in development mode with hot reload on port 3000.

#### Option 3: Docker Production
```bash
cd deploy
docker-compose --profile production up -d --build
```
This starts the app in production mode on port 3001.

## Project Structure

```
.
├── db/                    # Database services (PostgreSQL, pgAdmin)
│   └── docker-compose.yml
├── deploy/                # Application deployment
│   ├── Dockerfile         # Multi-stage Dockerfile (dev & prod)
│   └── docker-compose.yml # Single compose file (dev default, prod with profile)
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
- `cd deploy && docker-compose up` - Start app in Docker (dev mode, default)
- `cd deploy && docker-compose --profile production up -d` - Start app in Docker (prod mode)

## 📋 Use Cases

This parking reservation system is perfect for:
- **Office Buildings**: Manage employee and visitor parking
- **Event Venues**: Handle parking for events and conferences
- **Residential Complexes**: Organize parking for residents
- **Commercial Properties**: Manage tenant and customer parking
- **Universities**: Campus parking management
- **Hospitals**: Patient and visitor parking coordination

## 🔐 Google OAuth Setup

This application uses **Google OAuth 2.0** for secure authentication. Users can sign in with their Google accounts, eliminating the need for separate registration and password management.

### Benefits of Google Authentication:
- ✅ No password management required
- ✅ Enhanced security with Google's authentication
- ✅ Faster user onboarding
- ✅ Reduced authentication friction
- ✅ Trusted login experience

## 🐳 Docker Commands

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
# Development mode (default, with hot reload on port 3000)
cd deploy && docker-compose up --build

# Production mode (port 3001)
cd deploy && docker-compose --profile production up -d --build

# Stop application
cd deploy && docker-compose down
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with Google OAuth Provider
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: tRPC for type-safe APIs + REST endpoints
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## 📚 API Documentation

The application provides both tRPC and RESTful API endpoints:

### REST API Endpoints
- `GET /api/reservations` - List all reservations
- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations/[id]` - Get a specific reservation
- `PUT /api/reservations/[id]` - Update a reservation
- `DELETE /api/reservations/[id]` - Delete a reservation

All endpoints require Google OAuth authentication.

## 📝 License

This project is open source and available for educational and commercial use under the **MIT License with Attribution**.

## 👤 Author

**Yosakorn Sirisoot**

This project is part of the capstone project requirements for King Mongkut's Institute of Technology Ladkrabang (KMITL).

---

**Keywords**: parking reservation, parking booking, booking system, Google authentication, OAuth booking, parking management, Next.js booking, reservation system, Google Sign-In, parking app
