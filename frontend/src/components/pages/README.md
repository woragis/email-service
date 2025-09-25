# Pages Components

This directory is for page-specific components that are only used within a single page or route.

## Purpose

Page components are different from reusable components in that they:
- Are specific to a particular page or route
- Contain page-specific business logic
- May have dependencies on page-specific data
- Are not meant to be reused across different pages

## When to Use Page Components

Use this directory for:
- ✅ Complex page layouts that are unique to one page
- ✅ Page-specific data fetching components
- ✅ Components that combine multiple reusable components for a specific page
- ✅ Page-specific forms or workflows

Don't use this directory for:
- ❌ Reusable components (use `/common`, `/ui`, etc.)
- ❌ Layout components (use `/layout`)
- ❌ Generic forms (use `/forms`)

## Structure

```
pages/
├── HomePage/
│   ├── HomePage.tsx
│   ├── HomePage.css
│   └── index.ts
├── DashboardPage/
│   ├── DashboardPage.tsx
│   ├── DashboardPage.css
│   └── index.ts
└── [PageName]/
    ├── [PageName].tsx
    ├── [PageName].css
    └── index.ts
```

## Example Usage

```typescript
// pages/HomePage/HomePage.tsx
import { Hero } from '@/components/common';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

export function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <Hero />
      {isAuthenticated ? (
        <WelcomeBack user={user} />
      ) : (
        <CallToAction />
      )}
    </div>
  );
}

// pages/HomePage/index.ts
export { HomePage } from './HomePage';
```

## Best Practices

1. **Keep it focused**: Each page component should handle one specific page
2. **Compose, don't duplicate**: Use existing reusable components
3. **Separate concerns**: Keep page logic separate from reusable component logic
4. **Follow naming**: Use `[PageName]Page` convention
5. **Export cleanly**: Use index files for clean imports
