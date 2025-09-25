# Authentication System

This directory contains the authentication system implementation for the Jazz Melodic frontend.

## Features

- **Cookie-based persistence**: Auth tokens are stored in secure HTTP-only cookies
- **Automatic initialization**: Auth state is automatically restored on app startup
- **Zustand store**: Centralized auth state management
- **TanStack Query integration**: Seamless integration with React Query for data fetching
- **TypeScript support**: Full type safety throughout the auth system

## Architecture

### Core Components

1. **Auth Store** (`../stores/auth.ts`)
   - Centralized auth state management using Zustand
   - Handles token and user data persistence
   - Provides auth actions (login, logout, etc.)

2. **Auth Initializer** (`initializer.ts`)
   - Handles auth state initialization on app startup
   - Validates existing tokens
   - Fetches user data if token is valid

3. **Cookie Utils** (`../utils/cookies.ts`)
   - Secure cookie management
   - Auth-specific cookie helpers
   - SSR-safe implementation

4. **Auth Provider** (`../../components/providers/AuthProvider.tsx`)
   - React context provider for auth state
   - Handles auth initialization
   - Provides loading states

### Usage

#### Basic Auth Hook

```tsx
import { useAuth } from '@/lib/stores/auth';

function MyComponent() {
  const { user, token, isAuthenticated, isInitialized } = useAuth();
  
  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

#### Auth Actions

```tsx
import { useAuthActions } from '@/lib/stores/auth';

function LoginComponent() {
  const { setAuth, logout } = useAuthActions();
  
  const handleLogin = async (credentials) => {
    const authData = await authApi.login(credentials);
    setAuth(authData);
  };
  
  const handleLogout = () => {
    logout();
  };
}
```

#### Protected Routes

```tsx
import { withAuth } from '@/components/providers/AuthProvider';

const ProtectedPage = withAuth(MyPage, {
  requireAuth: true,
  redirectTo: '/login'
});
```

## Cookie Configuration

Auth cookies are configured with the following security settings:

- **Expires**: 7 days
- **Path**: `/` (available site-wide)
- **Secure**: `true` in production
- **SameSite**: `lax` (CSRF protection)
- **HttpOnly**: `false` (needed for client-side access)

## Security Considerations

1. **Token Storage**: Tokens are stored in cookies with appropriate security flags
2. **Automatic Cleanup**: Invalid/expired tokens are automatically removed
3. **CSRF Protection**: SameSite cookie attribute prevents CSRF attacks
4. **Secure Transport**: Cookies are only sent over HTTPS in production

## Testing

Visit `/auth-demo` to test the authentication system:

- Login/Register forms
- Auth status display
- Cookie persistence testing
- Logout functionality

## Migration Notes

This system replaces the previous localStorage-based auth with cookie-based persistence:

- **Before**: Tokens stored in localStorage with Zustand persist
- **After**: Tokens stored in secure cookies with manual persistence
- **Benefits**: Better security, automatic cleanup, SSR compatibility
