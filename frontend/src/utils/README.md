# Utils Directory

This directory contains utility functions and helper modules for common operations throughout the application.

## Structure

```
utils/
├── cookies.ts        # Cookie management utilities
├── localStorage.ts   # Local storage utilities
└── index.ts         # Utility exports
```

## Utility Categories

### 1. Storage Utilities

#### Cookies (`cookies.ts`)
Cookie management for authentication and preferences:
```typescript
export const cookieUtils = {
  // Set cookie
  set: (name: string, value: string, options?: CookieOptions) => {
    // Implementation
  },
  
  // Get cookie
  get: (name: string) => {
    // Implementation
  },
  
  // Remove cookie
  remove: (name: string) => {
    // Implementation
  },
  
  // Check if cookie exists
  exists: (name: string) => {
    // Implementation
  }
};

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}
```

#### Local Storage (`localStorage.ts`)
Local storage utilities with error handling:
```typescript
export const storageUtils = {
  // Set item with error handling
  set: <T>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  // Get item with type safety
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },
  
  // Remove item
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
  
  // Clear all items
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
};
```

## Common Utility Patterns

### 1. Date Utilities
```typescript
export const dateUtils = {
  // Format date
  format: (date: Date, format: string = 'YYYY-MM-DD') => {
    // Implementation using date-fns or similar
  },
  
  // Get relative time
  getRelativeTime: (date: Date) => {
    // Implementation
  },
  
  // Check if date is today
  isToday: (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },
  
  // Add days to date
  addDays: (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};
```

### 2. String Utilities
```typescript
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // Convert to slug
  slugify: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  },
  
  // Truncate text
  truncate: (str: string, length: number, suffix: string = '...') => {
    return str.length > length ? str.substring(0, length) + suffix : str;
  },
  
  // Generate random string
  randomString: (length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};
```

### 3. Validation Utilities
```typescript
export const validationUtils = {
  // Email validation
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Password strength validation
  isStrongPassword: (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  },
  
  // URL validation
  isValidUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // Phone number validation
  isValidPhone: (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
};
```

### 4. Array Utilities
```typescript
export const arrayUtils = {
  // Remove duplicates
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },
  
  // Group by property
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
  
  // Sort by property
  sortBy: <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  },
  
  // Chunk array into smaller arrays
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};
```

### 5. Object Utilities
```typescript
export const objectUtils = {
  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },
  
  // Pick specific properties
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      result[key] = obj[key];
    });
    return result;
  },
  
  // Omit specific properties
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },
  
  // Check if object is empty
  isEmpty: (obj: object): boolean => {
    return Object.keys(obj).length === 0;
  }
};
```

## Best Practices

### 1. Pure Functions
- Keep utility functions pure (no side effects)
- Make functions predictable and testable
- Avoid mutating input parameters

### 2. Type Safety
```typescript
// Use generic types for reusability
export function mapArray<T, U>(
  array: T[], 
  mapper: (item: T, index: number) => U
): U[] {
  return array.map(mapper);
}

// Use type guards for runtime type checking
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### 3. Error Handling
```typescript
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
}
```

### 4. Performance
```typescript
// Memoize expensive operations
export const memoize = <T extends (...args: any[]) => any>(
  fn: T
): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};
```

### 5. Testing
```typescript
// Make utilities easily testable
export const mathUtils = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
};
```

## Export Pattern

```typescript
// utils/index.ts
export * from './cookies';
export * from './localStorage';
export * from './dateUtils';
export * from './stringUtils';
export * from './validationUtils';
export * from './arrayUtils';
export * from './objectUtils';
```

## Usage Examples

```typescript
import { 
  cookieUtils, 
  storageUtils, 
  stringUtils, 
  validationUtils 
} from '@/utils';

// Cookie management
cookieUtils.set('theme', 'dark', { maxAge: 86400 });
const theme = cookieUtils.get('theme');

// Local storage
storageUtils.set('userPreferences', { language: 'en' });
const preferences = storageUtils.get('userPreferences', {});

// String manipulation
const slug = stringUtils.slugify('Hello World!'); // "hello-world"
const truncated = stringUtils.truncate('Long text', 10); // "Long text..."

// Validation
const isValid = validationUtils.isValidEmail('user@example.com');
```

## Adding New Utilities

1. **Create new file**: `utils/[utilityName].ts`
2. **Implement functions**: Follow established patterns
3. **Add types**: Include proper TypeScript types
4. **Export**: Add to `utils/index.ts`
5. **Test**: Write unit tests for new utilities
6. **Document**: Add JSDoc comments for complex functions
