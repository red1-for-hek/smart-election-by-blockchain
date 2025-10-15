# Bangladesh National Voting System
## বাংলাদেশ জাতীয় ভোটিং সিস্টেম

A secure, blockchain-based national election management system for Bangladesh that combines traditional physical voting with digital verification and transparency.

## 🎯 Overview

This system enables citizens to vote physically as usual while their votes are digitally recorded and verified using blockchain technology. Each voter can later verify their vote by logging in with their National ID (NID) and identity information.

## ✨ Key Features

- **Secure Authentication**: NID-based login and registration system
- **Geographic Voting**: Location-based candidate selection (Division → District → Upazila → Ward)
- **Blockchain Verification**: Immutable vote recording with hash generation
- **Vote Verification**: Citizens can verify their votes using NID
- **Real-time Statistics**: Live vote counts and election results
- **Postal/Expat Voting**: Special voting interface for overseas citizens
- **Multi-language Support**: Bengali-first interface with English fallback
- **Admin Dashboard**: Comprehensive election management tools

## 🏗️ Architecture

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Context API + TanStack Query
- **Routing**: Wouter

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with NID verification
- **Blockchain**: Simulated blockchain for vote integrity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bangladesh-voting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

### Development

**Start the full development environment:**
```bash
npm run dev
```

**Or run frontend and backend separately:**
```bash
# Frontend only
npm run frontend:dev

# Backend only  
npm run backend:dev
```

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
bangladesh-voting-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configurations
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.tsx         # Main application component
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Server entry point
│   ├── shared/             # Shared types and schemas
│   └── config/             # Configuration files
├── assets/                 # Static assets
├── docs/                   # Documentation
└── dist/                   # Production build output
```

## 🔐 Security Features

- **NID-based Authentication**: Secure voter identification
- **Blockchain Integrity**: Immutable vote records
- **Session Management**: Secure user sessions
- **Input Validation**: Comprehensive data validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API abuse prevention

## 🌐 Supported Languages

- **Bengali (বাংলা)**: Primary interface language
- **English**: Secondary/fallback language

## 📊 Geographic Coverage

- **8 Divisions**: Complete Bangladesh administrative coverage
- **64 Districts**: All districts included
- **Upazilas**: Comprehensive upazila mapping
- **Wards**: Local ward-level voting

## 🛠️ Technology Stack

### Frontend Technologies
- React 18+, TypeScript, Vite
- Tailwind CSS, Shadcn/ui, Radix UI
- TanStack Query, Wouter, Framer Motion
- Recharts, Lucide React

### Backend Technologies  
- Node.js, Express.js, TypeScript
- PostgreSQL, Drizzle ORM
- Passport.js, Express Session
- Zod validation

### Development Tools
- ESLint, Prettier
- Drizzle Kit, TSX
- Vite plugins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏛️ Government Compliance

This system is designed to meet Bangladesh Election Commission standards and requirements for digital voting systems.

## 📞 Support

For technical support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Bangladesh** 🇧🇩