# Tech Context

_Describes technologies used, development setup, technical constraints, and dependencies._

## Technology Stack

- **Frontend**: Next.js 15.4.5 with App Router
- **Styling**: Tailwind CSS v4 (inline configuration)
- **Language**: TypeScript (strict mode)
- **UI Components**: Custom components following shadcn/ui patterns
- **Authentication**: Client-side form handling (backend TBD)
- **Analytics**: Vercel Analytics and Speed Insights

## Development Setup

- **Node.js**: Latest LTS version
- **Package Manager**: npm
- **Build Tool**: Next.js with Turbopack for development
- **Linting**: ESLint with Next.js configuration
- **Fonts**: System fonts (fallback from Google Fonts for connectivity)

## Technical Constraints

- No external authentication service integrated yet
- Using demo credentials for testing (admin@church.com / password)
- Client-side validation only (no server-side validation yet)
- Static site capabilities with dynamic client components

## Dependencies

### Production Dependencies
- `next`: 15.4.5 (React framework)
- `react`: 19.1.0 (UI library)
- `react-dom`: 19.1.0 (DOM renderer)
- `@vercel/analytics`: 1.5.0 (analytics)
- `@vercel/speed-insights`: 1.2.0 (performance monitoring)

### Development Dependencies
- `typescript`: 5.x (type checking)
- `tailwindcss`: 4.x (styling)
- `eslint`: 9.x (linting)
- `@types/*`: Type definitions for Node, React, and React DOM
