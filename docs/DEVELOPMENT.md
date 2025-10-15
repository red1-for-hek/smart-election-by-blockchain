# Development Guide

## Project Structure

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
├── server/                  # Development server (placeholder)
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes placeholder
│   ├── storage.ts          # In-memory storage
│   └── vite.ts             # Vite development server
├── shared/                  # Shared types and schemas
├── assets/                 # Static assets
├── docs/                   # Documentation
└── dist/                   # Production build output
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
# Start full development environment
npm run dev

# Or start frontend only
npm run frontend:dev
```

### Building for Production
```bash
npm run build
```

## Frontend Architecture

### Technology Stack
- **React 18+** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Wouter** for routing
- **TanStack Query** for state management

### Component Organization
- `components/ui/` - Base UI components (buttons, inputs, etc.)
- `components/` - Business logic components
- `pages/` - Route-level page components
- `lib/` - Utilities, contexts, and configurations
- `hooks/` - Custom React hooks

### Key Features
- **Multi-language Support**: Bengali-first interface
- **Theme Support**: Light/dark mode
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliance target

## Demo Credentials

For development and testing:
- **NID**: 1234567890
- **Password**: NoPassword

## Backend Integration

The current server setup is a placeholder for development. The actual backend will be implemented separately with:
- Python/Django or Node.js
- Real blockchain integration
- PostgreSQL database
- Authentication system

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test your changes thoroughly
5. Update documentation as needed

## Code Quality

- Use ESLint for code linting
- Follow React best practices
- Implement proper error handling
- Use semantic HTML elements
- Ensure accessibility compliance