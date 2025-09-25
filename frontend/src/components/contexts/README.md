# Context Components

This directory is for React Context providers that manage shared state across multiple components.

## Purpose

Context components provide:
- Shared state management across component trees
- Global application state
- Theme, language, and other global settings
- User preferences and configuration

## When to Use Context

Use React Context for:
- ✅ Theme management (light/dark mode)
- ✅ User authentication state
- ✅ Language/locale settings
- ✅ Global application configuration
- ✅ State that needs to be shared across many components

Don't use Context for:
- ❌ Local component state (use useState)
- ❌ Server state (use React Query)
- ❌ Complex state with many actions (use Zustand)
- ❌ Props that are only passed down a few levels

## Structure

```
contexts/
├── ThemeContext/
│   ├── ThemeContext.tsx
│   ├── ThemeProvider.tsx
│   └── index.ts
├── AuthContext/
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   └── index.ts
└── [ContextName]/
    ├── [ContextName]Context.tsx
    ├── [ContextName]Provider.tsx
    └── index.ts
```

## Example Implementation

```typescript
// contexts/ThemeContext/ThemeContext.tsx
import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// contexts/ThemeContext/ThemeProvider.tsx
import { useState, useEffect } from 'react';
import { ThemeContext, Theme } from './ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// contexts/ThemeContext/index.ts
export { ThemeContext, useTheme } from './ThemeContext';
export { ThemeProvider } from './ThemeProvider';
export type { Theme } from './ThemeContext';
```

## Best Practices

### 1. Create Custom Hooks
Always create custom hooks for context consumption:
```typescript
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 2. Separate Context and Provider
Keep context definition separate from provider implementation for better organization.

### 3. Type Safety
Use TypeScript for context types and proper error handling:
```typescript
interface ContextType {
  // Define your context shape
}

export const Context = createContext<ContextType | undefined>(undefined);
```

### 4. Performance Optimization
Use context splitting for better performance:
```typescript
// Split state and actions into separate contexts
export const ThemeStateContext = createContext<ThemeState | undefined>(undefined);
export const ThemeActionsContext = createContext<ThemeActions | undefined>(undefined);
```

### 5. Provider Composition
```typescript
// Compose multiple providers
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
```

## Usage Examples

```typescript
// Using the theme context
import { useTheme } from '@/components/contexts';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}

// Using in app layout
import { ThemeProvider } from '@/components/contexts';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}
```

## Common Context Patterns

### 1. Settings Context
```typescript
interface SettingsContextType {
  language: string;
  setLanguage: (lang: string) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}
```

### 2. Modal Context
```typescript
interface ModalContextType {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}
```

### 3. Loading Context
```typescript
interface LoadingContextType {
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
}
```

## Adding New Contexts

1. **Create context folder**: `contexts/[ContextName]/`
2. **Define context**: Create `[ContextName]Context.tsx`
3. **Create provider**: Create `[ContextName]Provider.tsx`
4. **Export**: Create `index.ts` with exports
5. **Add to app**: Include provider in app provider composition
6. **Document**: Add usage examples and documentation
