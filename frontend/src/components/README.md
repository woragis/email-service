# Components Directory

This directory contains all reusable React components organized by type and functionality.

## Structure

```
components/
├── auth/             # Authentication components
├── common/           # Reusable content components
├── contexts/         # React Context providers
├── forms/            # Form components with validation
├── layout/           # Layout components (Header, Footer, etc.)
├── modals/           # Modal dialogs and overlays
├── pages/            # Page-specific components
├── providers/        # Context providers for app-wide state
└── ui/               # Base UI components (Button, Input, etc.)
```

## Component Organization Patterns

### 1. Component Folder Structure
Each component follows this pattern:
```
ComponentName/
├── ComponentName.tsx    # Main component file
├── ComponentName.css    # Component-specific styles
└── index.ts            # Export file for clean imports
```

### 2. Import/Export Pattern
```typescript
// ComponentName/index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';

// Usage
import { ComponentName } from '@/components/ui/ComponentName';
```

### 3. Component Categories

#### UI Components (`/ui`)
Base components that form the design system:
- Button, Input, Modal, Card, etc.
- Highly reusable with consistent API
- Minimal business logic

#### Layout Components (`/layout`)
Structural components for page layout:
- Header, Footer, Sidebar
- Navigation components
- Theme switcher

#### Form Components (`/forms`)
Specialized form components:
- Complex forms with validation
- Multi-step forms
- Form-specific UI patterns

#### Modal Components (`/modals`)
Dialog and overlay components:
- Create/Edit/Delete modals
- Confirmation dialogs
- Complex interactions

#### Common Components (`/common`)
Reusable content components:
- Content cards, lists, filters
- Data display components
- Business logic components

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition**: Build complex components by composing simpler ones
3. **Props Interface**: Define clear TypeScript interfaces for props
4. **Styling**: Use CSS modules or styled-components for component styles
5. **Testing**: Write tests for complex components
6. **Documentation**: Document component props and usage examples

## Example Component Structure

```typescript
// Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```
