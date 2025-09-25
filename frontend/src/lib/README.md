# Lib Directory

This directory contains core utilities, API clients, configurations, and shared libraries.

## Structure

```
lib/
├── api/              # API client modules
│   ├── auth.ts       # Authentication API calls
│   ├── index.ts      # API exports
│   └── [feature].ts  # Feature-specific API calls
├── auth/             # Authentication utilities
│   ├── index.ts      # Auth exports
│   ├── initializer.ts # Auth initialization
│   └── README.md     # Auth documentation
├── apiClient.ts      # Base API client configuration
├── env.ts           # Environment variable utilities
└── queryClient.ts   # React Query client configuration
```

## Core Files

### 1. API Client (`apiClient.ts`)
Base HTTP client configuration with:
- Request/response interceptors
- Authentication headers
- Error handling
- Base URL configuration

### 2. Environment Utilities (`env.ts`)
Environment variable management:
- Type-safe environment variable access
- Validation of required variables
- Default value handling

### 3. Query Client (`queryClient.ts`)
React Query configuration:
- Default query options
- Global error handling
- Cache configuration
- DevTools integration

## API Module Pattern

### 1. Feature API Module
```typescript
// lib/api/[feature].ts
import { apiClient } from '../apiClient';

export interface YourDataType {
  id: string;
  name: string;
  // ... other properties
}

export interface CreateYourDataRequest {
  name: string;
  // ... other properties
}

export const yourApi = {
  // GET operations
  getAll: () => apiClient.get<YourDataType[]>('/your-data'),
  getById: (id: string) => apiClient.get<YourDataType>(`/your-data/${id}`),
  
  // POST operations
  create: (data: CreateYourDataRequest) => 
    apiClient.post<YourDataType>('/your-data', data),
  
  // PUT operations
  update: (id: string, data: Partial<YourDataType>) => 
    apiClient.put<YourDataType>(`/your-data/${id}`, data),
  
  // DELETE operations
  delete: (id: string) => 
    apiClient.delete(`/your-data/${id}`),
};
```

### 2. API Index Export
```typescript
// lib/api/index.ts
export { authApi } from './auth';
export { yourApi } from './yourFeature';
export { apiClient } from '../apiClient';
```

## Authentication Module

The auth directory contains authentication-related utilities:
- Token management
- User session handling
- Authentication state initialization
- Protected route utilities

## Best Practices

1. **Separation of Concerns**: Keep API logic separate from UI logic
2. **Type Safety**: Use TypeScript interfaces for all API requests/responses
3. **Error Handling**: Implement consistent error handling across all API calls
4. **Caching**: Use React Query for intelligent caching and synchronization
5. **Environment Configuration**: Use environment variables for API endpoints and keys
6. **Testing**: Write tests for API modules and utilities
7. **Documentation**: Document API endpoints and their expected data structures

## Usage Examples

### API Client Usage
```typescript
import { yourApi } from '@/lib/api';

// In a hook
const { data, isLoading } = useQuery({
  queryKey: ['yourData'],
  queryFn: yourApi.getAll,
});
```

### Environment Variables
```typescript
import { env } from '@/lib/env';

const apiUrl = env.NEXT_PUBLIC_API_URL;
const apiKey = env.NEXT_PUBLIC_API_KEY;
```

### Query Client Setup
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

## Adding New Features

1. Create a new API module in `lib/api/[feature].ts`
2. Define TypeScript interfaces for your data types
3. Implement CRUD operations following the established pattern
4. Export the API module in `lib/api/index.ts`
5. Create corresponding hooks in `hooks/[feature].ts`
6. Add the hooks to `hooks/index.ts`
