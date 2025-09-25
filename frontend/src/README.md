# Frontend Source Structure

This directory contains the main source code for the frontend application following a clean, scalable architecture pattern.

## Directory Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components organized by type
├── hooks/           # Custom React hooks for state management and API calls
├── lib/             # Core utilities, API clients, and configurations
├── stores/          # State management (Zustand stores)
├── styles/          # Global CSS and styling utilities
├── types/           # TypeScript type definitions
└── utils/           # Helper functions and utilities
```

## Key Patterns

### Component Organization
- **components/auth/**: Authentication-related components
- **components/common/**: Reusable content components
- **components/forms/**: Form components with validation
- **components/layout/**: Layout components (Header, Footer, etc.)
- **components/modals/**: Modal dialogs and overlays
- **components/providers/**: Context providers
- **components/ui/**: Base UI components (Button, Input, etc.)

### File Naming Convention
- Each component has its own folder with:
  - `ComponentName.tsx` - Main component file
  - `ComponentName.css` - Component-specific styles
  - `index.ts` - Export file for clean imports

### Import Pattern
```typescript
// Use index files for clean imports
import { Button, Modal } from '@/components/ui';
import { useAuth } from '@/hooks';
```

## Getting Started

1. Follow the existing patterns when creating new components
2. Use the established folder structure
3. Create index files for clean exports
4. Follow TypeScript best practices
5. Use the existing UI components as building blocks
