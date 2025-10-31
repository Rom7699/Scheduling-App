# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack TypeScript scheduling application with a React frontend and Express.js backend.

### Architecture
- **Frontend**: React with TypeScript, Vite build system, Bootstrap styling
- **Backend**: Express.js with TypeScript, MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with admin/user roles
- **Email**: Nodemailer integration for notifications

### Directory Structure
```
client/src/
├── components/        # Reusable UI components
│   ├── Calendar/     # Calendar-specific components
│   └── DashBoard/    # Dashboard components
├── context/          # React context providers (Auth, Session)
├── pages/            # Route components
├── services/         # API client functions
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

server/src/
├── controllers/      # Request handlers
├── middleware/       # Custom middleware (auth)
├── models/           # Mongoose schemas (User, Session)
├── routes/           # Express route definitions
└── services/         # Business logic (email)
```

## Development Commands

### Root Level
- `npm run dev`: Start both server and client in development mode
- `npm run build`: Build entire application (server + client)
- `npm start`: Start production server
- `npm run test:server`: Run server tests with Jest
- `npm run test:client`: Run client tests with Vitest
- `npm run test:watch`: Run client tests in watch mode

### Client (`cd client`)
- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint

### Server (`cd server`)
- `npm run dev`: Start with nodemon + ts-node
- `npm run build`: Compile TypeScript
- `npm run lint`: Run ESLint

## Core Models

### User Model
- Authentication with bcrypt password hashing
- Admin/user role system
- JWT token generation

### Session Model
- Session scheduling with time validation
- Status workflow: pending → approved/rejected/cancelled
- Recurring session support (weekly, biweekly, monthly)
- Payment tracking with `isPaid` field
- Admin status change notifications via email

## Key Features

### Authentication Flow
- JWT-based authentication
- Protected routes with `PrivateRoute` component
- Admin-only routes with role checking
- Context providers for auth state management

### Session Management
- Calendar-based session booking
- Admin approval workflow with email notifications
- Session time constraints (current/next month only)
- Recurring session creation and management
- Payment status tracking

### Email Notifications
- Automated emails for status changes
- Admin notifications for session updates
- Configurable via environment variables

## API Configuration

The client uses axios with base URL configuration:
- Development: `http://localhost:5500` (default)
- Production: Set via `VITE_API_URL` environment variable

## Database

MongoDB with Mongoose ODM. Connection string configured via `MONGO_URI` environment variable, defaults to `mongodb://localhost:27017/scheduling-app`.

## Visual Development

### Design Principles
- Comprehensive design checklist in `/claude/design-principles.md`
- Brand style guide in `/claude/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing