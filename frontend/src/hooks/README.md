# Hooks Directory

This directory contains custom React hooks for state management, API calls, and reusable logic.

## Structure

```
hooks/
├── auth.ts          # Authentication-related hooks
├── index.ts         # Central export file
└── [feature].ts     # Feature-specific hooks
```

## Hook Categories

### 1. Authentication Hooks (`auth.ts`)
Hooks for user authentication and session management:
- `useMe()` - Get current user data
- `useLogin()` - Login functionality
- `useRegister()` - Registration functionality
- `useLogout()` - Logout functionality
- `useUpdateProfile()` - Update user profile
- `useChangePassword()` - Change password
- `useRequestPasswordReset()` - Request password reset
- `useResetPassword()` - Reset password
- `useVerifyEmail()` - Email verification
- `useResendVerification()` - Resend verification email
- `useDeleteAccount()` - Delete user account

### 2. Feature-Specific Hooks
Create hooks for specific features following the pattern:
```typescript
// [feature].ts
export function useYourFeature() {
  // Hook implementation
}
```

## Hook Patterns

### 1. API Hook Pattern
```typescript
export function useYourData() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['yourData'],
    queryFn: () => yourApi.getData(),
  });

  const mutation = useMutation({
    mutationFn: yourApi.createData,
    onSuccess: () => {
      queryClient.invalidateQueries(['yourData']);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    create: mutation.mutate,
    isCreating: mutation.isPending,
  };
}
```

### 2. State Management Hook Pattern
```typescript
export function useLocalState() {
  const [state, setState] = useState(initialValue);
  
  const actions = useMemo(() => ({
    update: (newValue: any) => setState(newValue),
    reset: () => setState(initialValue),
  }), []);

  return { state, ...actions };
}
```

### 3. Form Hook Pattern
```typescript
export function useYourForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    // Validation logic
  }, []);

  const submit = useCallback(async () => {
    if (validate()) {
      // Submit logic
    }
  }, [validate]);

  return {
    formData,
    setFormData,
    errors,
    submit,
    isValid: Object.keys(errors).length === 0,
  };
}
```

## Best Practices

1. **Single Responsibility**: Each hook should handle one specific concern
2. **Reusability**: Make hooks generic enough to be reused across components
3. **Error Handling**: Include proper error handling and loading states
4. **TypeScript**: Use proper TypeScript types for all hook parameters and return values
5. **Dependencies**: Be careful with dependency arrays in useEffect and useMemo
6. **Testing**: Write tests for complex hooks
7. **Documentation**: Document hook parameters, return values, and usage examples

## Export Pattern

```typescript
// hooks/index.ts
export {
  useMe,
  useLogin,
  useRegister,
  // ... other auth hooks
} from './auth';

export {
  useYourFeature,
  // ... other feature hooks
} from './yourFeature';
```

## Usage Examples

```typescript
// In a component
import { useAuth, useYourData } from '@/hooks';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { data, isLoading, create } = useYourData();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataList data={data} onCreate={create} />
      )}
    </div>
  );
}
```
