## Overview

EduPlatform is a comprehensive, full-stack learning management system designed for online education. It provides a platform for students, instructors, and administrators to manage courses, track progress, and facilitate learning. The system emphasizes a user-friendly interface, robust authentication, and real-time data insights, aiming to deliver a seamless and engaging educational experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Framework**: Tailwind CSS with shadcn/ui and Radix UI primitives
- **Styling**: CSS variables for theming with dark/light mode support. UI/UX design emphasizes modern aesthetics with gradients, animated elements, and a clean, intuitive layout. This includes comprehensive redesigns of the landing page, dashboard, course detail pages, and administrative panels to ensure a visually appealing and highly interactive experience.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (previously MongoDB, now migrated)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful APIs with JSON responses
- **Development**: tsx for TypeScript execution

### Core Features and Implementations
- **Authentication & Authorization**: Supports email/password with JWT tokens and Replit OpenID Connect (and Google OAuth). Implements role-based access control (student, instructor, admin) and a user approval workflow for new student registrations. JWT tokens are stored in `localStorage`.
- **Course Management**: Comprehensive CRUD operations for courses, including video lectures (YouTube integration) and downloadable PDF notes.
- **Learning Progression**: Students can mark video lectures as completed with persistence, and track overall course progress.
- **Assessment System**: Admins can create and manage tests for courses. A comprehensive grading interface allows instructors to assign scores and grades, with students viewing their results. Test results are filtered based on student enrollment.
- **Dashboards**:
    - **Student Dashboard**: Personalized overview with progress tracking.
    - **Admin Dashboard**: Provides comprehensive, real-time platform-wide statistics (e.g., total courses, unique students, average test scores, completion rates) with dynamic course filtering. Analytics are designed for manual refresh only, removing continuous auto-refresh to improve performance.
- **UI/UX Decisions**:
    - **Navigation**: Replaced traditional navbar with a consistent sidebar navigation across all authenticated pages.
    - **Visuals**: Extensive use of gradients, shadows, animations (hover, pulsing, animated backgrounds), and modern typography. Components like course cards, test sections, and forms have received significant visual overhauls for a clean, professional, and interactive feel.
    - **Responsiveness**: Design maintains mobile compatibility.

### Data Flow
- Frontend communicates with backend via HTTP requests to `/api` endpoints.
- Backend processes requests, interacts with PostgreSQL via Drizzle ORM, and sends JSON responses.
- TanStack Query manages client-side data fetching, caching, and state updates.

## External Dependencies

### Frontend
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns
- **Icons**: Lucide React
- **Carousel**: Embla Carousel

### Backend
- **Database Connection**: @neondatabase/serverless
- **ORM**: Drizzle ORM
- **Session Management**: connect-pg-simple (for PostgreSQL session store)
- **Validation**: Zod
- **Email Service**: Nodemailer (for OTP email verification)
- **Authentication**: passport-google-oauth20 (for Google OAuth)

### Development Tools
- **Build**: esbuild (for server bundling)
- **Database Tools**: Drizzle Kit (for migrations and schema management)