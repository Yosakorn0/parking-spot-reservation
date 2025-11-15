# Parking Spot Reservation

A parking spot reservation system built with the T3 Stack, allowing users to reserve parking spots with Google OAuth authentication.

## 🚀 Tech Stack

This project uses the [T3 Stack](https://create.t3.gg/) and includes:

- **[Next.js](https://nextjs.org)** - React framework with App Router
- **[NextAuth.js](https://next-auth.js.org)** - Authentication (Google OAuth)
- **[Drizzle ORM](https://orm.drizzle.team)** - TypeScript ORM for PostgreSQL
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker Desktop (for local database)
- Google Cloud Console account (for OAuth)

## 🛠️ Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Auth
AUTH_SECRET=your-generated-secret-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/parking-spot-reservation

# Node Environment
NODE_ENV=development
```

**Generate AUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to **APIs & Services** → **Credentials**
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy the Client ID and Client Secret to your `.env` file

**Note:** The app restricts login to `@kmitl.ac.th` email addresses.

### 3. Database Setup

Start PostgreSQL and pgAdmin using Docker Compose:

```bash
docker compose up -d
```

Or use the npm script:

```bash
npm run db:start
```

This will start:
- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050`

### 4. Database Schema

Push the database schema:

```bash
npm run db:push
```

### 5. Access pgAdmin

1. Open http://localhost:5050
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Register a new server:
   - **Host:** `postgres`
   - **Port:** `5432`
   - **Database:** `parking-spot-reservation`
   - **Username:** `postgres`
   - **Password:** `password`

## 🚦 Running the Application

### Development

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database
- `npm run db:start` - Start PostgreSQL and pgAdmin
- `npm run db:stop` - Stop database containers
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations
- `npm run db:logs` - View database logs

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Type check TypeScript
- `npm run format:check` - Check code formatting
- `npm run format:write` - Format code

## 🗄️ Database Management

### Using Docker Compose

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f postgres
```

### Using pgAdmin

Access the web interface at http://localhost:5050 to:
- Browse database tables
- Run SQL queries
- Manage database structure
- View data

## 🔐 Authentication

The app uses Google OAuth for authentication. Users with `@kmitl.ac.th` email addresses can sign in.

To test authentication:
1. Ensure Google OAuth credentials are set in `.env`
2. Click "Continue with Google" on the login page
3. Sign in with a valid `@kmitl.ac.th` email

## 📁 Project Structure

```
parking-reserve/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/          # React components
│   ├── server/           # Server-side code
│   │   ├── api/         # tRPC routers
│   │   ├── auth/        # NextAuth configuration
│   │   └── db/          # Database schema and connection
│   └── lib/             # Utility functions
├── docker-compose.yml    # Docker services configuration
└── .env                 # Environment variables (not committed)
```

## 📝 License

This project is private and proprietary.
