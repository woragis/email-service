# Types Directory

This directory contains TypeScript type definitions and interfaces used throughout the application.

## Structure

```
types/
├── api.ts           # API-related type definitions
└── platform.ts     # Platform and environment types
```

## Type Organization

### 1. API Types (`api.ts`)
Type definitions for API requests, responses, and data models:

```typescript
// Base API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Data model types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
```

### 2. Platform Types (`platform.ts`)
Platform-specific and environment types:

```typescript
// Environment types
export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  apiUrl: string;
  environment: Environment;
  version: string;
  features: {
    auth: boolean;
    analytics: boolean;
    notifications: boolean;
  };
}

// Platform detection
export type Platform = 'web' | 'mobile' | 'desktop';

export interface PlatformInfo {
  platform: Platform;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Browser types
export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
}
```

## Type Patterns

### 1. Generic Types
Use generic types for reusable patterns:

```typescript
// Generic entity type
export interface Entity<T = string> {
  id: T;
  createdAt: string;
  updatedAt: string;
}

// Generic form state
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Generic API hook return type
export interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
```

### 2. Union Types
Use union types for constrained values:

```typescript
export type Theme = 'light' | 'dark' | 'system';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type SortOrder = 'asc' | 'desc';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
```

### 3. Utility Types
Create utility types for common transformations:

```typescript
// Make all properties optional except id
export type PartialExceptId<T> = Partial<T> & Pick<T, 'id'>;

// Make specific properties required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract API response data type
export type ApiData<T> = T extends ApiResponse<infer U> ? U : never;

// Form field types
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};
```

### 4. Discriminated Unions
Use discriminated unions for type-safe state management:

```typescript
export type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };

export type AsyncState<T, E = string> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };
```

## Best Practices

### 1. Naming Conventions
- Use PascalCase for interfaces and types
- Use descriptive names that indicate purpose
- Use suffixes like `Request`, `Response`, `Props`, `State`

### 2. Documentation
```typescript
/**
 * Represents a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** User's email address */
  email: string;
  
  /** User's display name */
  name: string;
  
  /** User's role in the system */
  role: UserRole;
  
  /** When the user was created */
  createdAt: string;
  
  /** When the user was last updated */
  updatedAt: string;
}
```

### 3. Reusability
- Create generic types for common patterns
- Extract shared types to avoid duplication
- Use type composition over inheritance

### 4. Strictness
```typescript
// Use strict types instead of any
export interface ApiResponse<T> {
  data: T;
  // Instead of: data: any;
}

// Use const assertions for immutable data
export const USER_ROLES = ['admin', 'user', 'moderator'] as const;
export type UserRole = typeof USER_ROLES[number];
```

### 5. Validation
```typescript
// Use branded types for validation
export type Email = string & { readonly __brand: 'Email' };
export type UserId = string & { readonly __brand: 'UserId' };

export function createEmail(email: string): Email {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email');
  }
  return email as Email;
}
```

## Usage Examples

### In Components
```typescript
import { User, UserRole } from '@/types/api';

interface UserCardProps {
  user: User;
  onRoleChange: (role: UserRole) => void;
}

export function UserCard({ user, onRoleChange }: UserCardProps) {
  // Component implementation
}
```

### In Hooks
```typescript
import { UseApiReturn, User } from '@/types';

export function useUsers(): UseApiReturn<User[]> {
  // Hook implementation
}
```

### In API Modules
```typescript
import { ApiResponse, PaginatedResponse, User } from '@/types/api';

export const userApi = {
  getAll: (): Promise<PaginatedResponse<User>> => {
    // API implementation
  },
  
  getById: (id: string): Promise<ApiResponse<User>> => {
    // API implementation
  },
};
```

## Adding New Types

1. **API Types**: Add to `api.ts` for API-related types
2. **Platform Types**: Add to `platform.ts` for platform/environment types
3. **Feature Types**: Create new files for feature-specific types
4. **Shared Types**: Add to appropriate existing file or create new one
5. **Export**: Export types from the main file or create index file
