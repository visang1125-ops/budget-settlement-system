# Budget & Settlement Management System

## Overview

This is a corporate budget and settlement visualization dashboard built to help organizations track and analyze departmental spending. The application provides comprehensive financial analytics including budget execution rates, departmental comparisons, and annual cost projections. It features a skeuomorphic design approach with realistic depth and tactile elements to enhance the data-intensive financial interface.

The system enables filtering by time periods, departments, and account categories, presenting data through interactive charts, KPI cards, and detailed data tables. Users can monitor budget compliance, identify spending trends, and make data-driven financial decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript in SPA (Single Page Application) mode
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks (useState) for local state, TanStack Query for server state
- **Build Tool**: Vite with custom configuration for development and production builds
- **Styling**: Tailwind CSS with custom design tokens for skeuomorphic design system

**Component Structure**:
- **UI Components**: shadcn/ui library (Radix UI primitives) for accessible, customizable base components
- **Custom Components**: Domain-specific components for budget visualization (charts, KPI cards, data tables)
- **Layout**: Sidebar-based navigation with collapsible filtering panel
- **Theme System**: Light/dark mode support with ThemeProvider context

**Design Philosophy**:
- Skeuomorphic approach with realistic depth, shadows, and gradients
- Korean language support (Noto Sans KR font) alongside English
- Accessibility-first with ARIA labels and keyboard navigation
- Mobile-responsive with breakpoint-based layouts

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- **Development Mode**: Vite middleware integration for HMR (Hot Module Replacement)
- **Production Mode**: Serves pre-built static assets from dist/public
- **API Design**: RESTful endpoints under /api namespace

**Data Layer**:
- **Current Implementation**: In-memory storage with mock data generation
- **ORM**: Drizzle ORM configured for PostgreSQL (ready for database integration)
- **Schema**: Type-safe schema definitions in shared/schema.ts
- **Data Types**: 
  - 4 departments (DX Strategy, Service Innovation, Platform Innovation, Back Office Innovation)
  - 8 account categories (advertising, communications, fees, maintenance, etc.)
  - Budget entries with monthly granularity and execution rate tracking

**API Endpoints**:
- `GET /api/budget` - Retrieve budget entries with optional filtering (startMonth, endMonth, year, departments, accountCategories)
- Query string parsing with Zod schema validation
- Support for multiple department and category filters

**Rationale for In-Memory Storage**: 
- Enables rapid prototyping and development without database setup
- Mock data generator creates realistic financial scenarios
- Easy transition to PostgreSQL when persistence is needed (Drizzle configuration already in place)

### External Dependencies

**Database** (Configured but not yet connected):
- **Provider**: Neon Serverless PostgreSQL (@neondatabase/serverless)
- **Migration Tool**: Drizzle Kit for schema migrations
- **Connection**: Environment variable DATABASE_URL required for activation

**UI Component Library**:
- **shadcn/ui**: Collection of 30+ Radix UI-based components
- **Radix UI Primitives**: Accordion, Dialog, Dropdown, Select, Tabs, Toast, Tooltip, etc.
- **Reason**: Provides accessible, customizable components without runtime bundle bloat

**Data Visualization**:
- **Recharts**: React charting library for bar charts, line charts, donut charts
- **Features**: Responsive containers, gradients, tooltips, custom legends

**Form Handling**:
- **React Hook Form**: Form state management and validation
- **Hookform Resolvers**: Zod schema integration for type-safe validation

**Date Utilities**:
- **date-fns**: Lightweight date manipulation and formatting

**Styling & Utilities**:
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **clsx + tailwind-merge**: Conditional className composition

**Session Management** (Configured):
- **connect-pg-simple**: PostgreSQL session store for Express
- **Ready for authentication implementation**

**Development Tools**:
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Strict type checking with path aliases (@/, @shared/, @assets/)
- **ESBuild**: Production bundling for server code

### Architecture Trade-offs

**Chosen**: Monorepo structure with shared types between client and server
- **Pro**: Single source of truth for data models, reduced duplication
- **Con**: Tighter coupling between frontend and backend

**Chosen**: In-memory storage with Drizzle ORM prepared
- **Pro**: Zero-config development, easy local testing
- **Con**: Data lost on restart (acceptable for MVP, migrations ready for production)

**Chosen**: Vite for frontend, Express for backend (separate processes in dev)
- **Pro**: Fast HMR, optimal developer experience
- **Con**: Additional complexity vs. Next.js-style framework

**Chosen**: shadcn/ui over component library like Material-UI
- **Pro**: Full customization control, no runtime overhead, better tree-shaking
- **Con**: More initial setup, manual component installation