# Jazz Melodic Frontend

A modern React/Next.js frontend for the Jazz Melodic platform with comprehensive API integration, authentication, and state management.

## Features

- **Modern Stack**: Next.js 15, React 19, TypeScript
- **State Management**: Zustand for global state, TanStack Query for server state
- **Authentication**: JWT-based auth with automatic token management
- **API Integration**: Axios-based client with interceptors and error handling
- **Type Safety**: Full TypeScript integration with backend types
- **Developer Experience**: React Query Devtools, ESLint, Tailwind CSS

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Shared components
│   │   ├── layout/            # Layout components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # Base UI components
│   ├── hooks/                 # Custom React hooks
│   │   └── auth.ts            # Authentication hooks
│   ├── lib/                   # Utility libraries
│   │   ├── api/               # API functions
│   │   │   └── auth.ts        # Auth API functions
│   │   ├── stores/            # Zustand stores
│   │   │   └── auth.ts        # Auth store
│   │   ├── apiClient.ts       # Axios client with interceptors
│   │   ├── env.ts             # Environment configuration
│   │   └── queryClient.ts     # TanStack Query configuration
│   ├── types/                 # TypeScript type definitions
│   │   ├── api.ts             # API response types
│   │   └── platform.ts        # Platform-specific types
│   └── styles/                # Global styles
└── package.json
```

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see backend README)

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Optional Configuration
NEXT_PUBLIC_SITE_NAME=Jazz Melodic
NEXT_PUBLIC_SITE_DESCRIPTION=Where Technique Meets Artistry
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Integration

### API Client

The `apiClient` provides a configured Axios instance with:

- **Automatic Auth**: JWT tokens are automatically added to requests
- **Error Handling**: Centralized error handling with user-friendly messages
- **Interceptors**: Request/response interceptors for auth and error handling
- **Type Safety**: Full TypeScript support with generic response types

```typescript
import { apiClient } from '@/lib/apiClient';

// GET request
const response = await apiClient.get<User>('/api/auth/me');

// POST request
const response = await apiClient.post<AuthResponse>('/api/auth/login', data);

// File upload
const response = await apiClient.upload<FileResponse>('/api/upload', file);
```

### API Functions

Domain-specific API functions are organized in the `lib/api/` directory:

```typescript
import { authApi } from '@/lib/api/auth';

// Register user
const authData = await authApi.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password123',
});

// Login user
const authData = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
});
```

## State Management

### Authentication Store (Zustand)

The auth store manages user authentication state:

```typescript
import { useAuth, useAuthActions } from '@/lib/stores';

function MyComponent() {
  const { user, isAuthenticated, token } = useAuth();
  const { setAuth, logout } = useAuthActions();

  // Use auth state and actions
}
```

### Server State (TanStack Query)

Use custom hooks for server state management:

```typescript
import { useMe, useLogin, useRegister } from '@/hooks';

function LoginForm() {
  const loginMutation = useLogin();
  const { data: user } = useMe();

  const handleLogin = (data) => {
    loginMutation.mutate(data);
  };
}
```

## Authentication

### Auth Hooks

The authentication system provides comprehensive hooks:

- `useMe()` - Get current user profile
- `useLogin()` - Login mutation
- `useRegister()` - Registration mutation
- `useLogout()` - Logout mutation
- `useUpdateProfile()` - Update user profile
- `useChangePassword()` - Change password
- `useRequestPasswordReset()` - Request password reset
- `useResetPassword()` - Reset password with token
- `useVerifyEmail()` - Verify email address
- `useResendVerification()` - Resend verification email
- `useDeleteAccount()` - Delete user account

### Auth Store

The auth store provides:

- **State**: `user`, `token`, `isAuthenticated`, `isLoading`, `error`
- **Actions**: `setAuth`, `setUser`, `setToken`, `setLoading`, `setError`, `clearAuth`, `logout`

### Automatic Token Management

- Tokens are automatically added to API requests
- Expired tokens trigger automatic logout
- Auth state persists across browser sessions
- 401 errors automatically redirect to login

## Usage Examples

### Login Form

```typescript
import { useLogin } from '@/hooks';
import { useAuth } from '@/lib/stores';

function LoginForm() {
  const { error } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

### Protected Route

```typescript
import { useAuth } from '@/lib/stores';
import { useMe } from '@/hooks';

function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  const { data: user, isLoading } = useMe();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Welcome, {user?.username}!</div>;
}
```

### App Setup

```typescript
import { QueryProvider } from '@/components/providers';

export default function App() {
  return (
    <QueryProvider>
      {/* Your app content */}
    </QueryProvider>
  );
}
```

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# With Turbopack (faster)
npm run dev --turbopack
npm run build --turbopack
```

### Testing the Integration

1. Start the backend server (see backend README)
2. Start the frontend: `npm run dev`
3. Visit `http://localhost:3000/auth-demo` to test authentication
4. Use React Query Devtools (available in development) to inspect queries

### Adding New API Endpoints

1. **Add API function** in `lib/api/[domain].ts`:
```typescript
export const domainApi = {
  getItems: async (): Promise<Item[]> => {
    const response = await apiClient.get<Item[]>('/api/domain/items');
    return response.data!;
  },
};
```

2. **Add TanStack Query hook** in `hooks/[domain].ts`:
```typescript
export const useItems = () => {
  return useQuery({
    queryKey: ['domain', 'items'],
    queryFn: domainApi.getItems,
  });
};
```

3. **Use in components**:
```typescript
function ItemsList() {
  const { data: items, isLoading } = useItems();
  // Render items
}
```

## Dependencies

### Core
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety

### State Management
- **Zustand** - Global state management
- **TanStack Query** - Server state management
- **@tanstack/react-query-devtools** - Development tools

### HTTP Client
- **Axios** - HTTP client with interceptors

### Styling
- **Tailwind CSS** - Utility-first CSS framework

## License

This project is part of the Jazz Melodic platform.