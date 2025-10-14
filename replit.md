# Bangladesh National Voting System (বাংলাদেশ জাতীয় ভোটিং সিস্টেম)

## Overview

A blockchain-based secure national election management system for Bangladesh. The system allows citizens to cast votes digitally with blockchain verification while maintaining transparency and security. Key features include:

- **User Authentication**: NID-based login/registration system
- **Voting Dashboard**: Location-based candidate selection (division → district → upazila → ward)
- **Blockchain Simulation**: Vote recording with block hash generation and verification
- **Vote Verification**: Citizens can verify their votes using NID
- **Real-time Statistics**: Live vote counts and election results with filtering capabilities
- **Postal/Expat Voting**: Special voting interface for overseas citizens
- **Multi-language Support**: Bengali-first interface with English fallback

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, Vite build tooling

**UI Components**: 
- Shadcn/ui component library (New York style preset)
- Radix UI primitives for accessible components
- Tailwind CSS for styling with custom color system

**State Management**:
- React Context API for voting state (`VotingProvider`)
- TanStack Query (React Query) for server state management
- Wouter for client-side routing

**Design System**:
- Bengali-first typography (Noto Sans Bengali, Hind Siliguri via Google Fonts)
- Government-inspired color palette (Bangladesh green #006747, deep red accents)
- Light/dark mode support with theme provider
- WCAG 2.1 AAA accessibility compliance target

**Key Features**:
- Real-time voting status tracking (not_voted → verifying → voted)
- Multi-step verification dialogs (NID verification, vote confirmation, photo capture)
- Geographic data filtering for Bangladesh (8 divisions, districts, upazilas)
- Blockchain explorer UI for vote transparency

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Development Setup**:
- Vite middleware integration for HMR in development
- Custom logging and error handling middleware
- Session-based authentication preparation

**Storage Interface**:
- Abstract `IStorage` interface for data operations
- In-memory storage implementation (`MemStorage`) as default
- Designed for easy migration to PostgreSQL with Drizzle ORM

**API Structure**:
- RESTful endpoints prefixed with `/api`
- Routes registered in `server/routes.ts`
- Storage abstraction allows CRUD operations on users, votes, candidates

### Data Storage Solutions

**Database**: 
- **Current**: In-memory storage for development
- **Production Ready**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Zod schema validation
- **Migrations**: Drizzle Kit for schema management

**Schema Design**:
- Users table: id, username (NID), password
- Extensible for votes, candidates, blockchain records
- UUID primary keys with PostgreSQL `gen_random_uuid()`

**Blockchain Simulation**:
- Mock blockchain with block hash generation
- Vote records contain: voter ID (hidden), candidate ID, timestamp, previous hash
- Verification system to prevent double voting

### Authentication & Authorization

**Current Implementation**:
- Mock authentication with hardcoded credentials (NID: 1234567890, password: NoPassword)
- Client-side route protection via location checks

**Production Architecture**:
- NID-based user identification
- Password hashing (prepared for bcrypt/argon2)
- Session management with connect-pg-simple
- Multi-factor verification (photo capture, NID scan)

**Authorization Levels**:
- Voter accounts: basic voting and verification
- Admin accounts: dashboard access, statistics viewing (prepared)
- Expat/Postal voters: special voting permissions

### External Dependencies

**Third-party Services**:
- **Google Fonts CDN**: Bengali typography (Noto Sans Bengali, Hind Siliguri)
- **Neon Database**: Serverless PostgreSQL hosting
- **Recharts**: Data visualization for election statistics

**Development Tools**:
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner
- **ESBuild**: Server-side bundling for production
- **Drizzle Kit**: Database schema management

**UI Libraries**:
- **Radix UI**: Headless accessible components (dialogs, dropdowns, navigation)
- **Lucide React**: Icon system
- **Embla Carousel**: Carousel functionality
- **class-variance-authority**: Variant-based component styling
- **cmdk**: Command menu interface

**Geographic Data**:
- Embedded Bangladesh administrative divisions data
- 8 divisions with full district and upazila mappings
- Client-side filtering without external API calls