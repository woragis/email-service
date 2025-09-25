# App Directory

This directory follows Next.js 13+ App Router conventions for file-based routing and layouts.

## Structure

```
app/
├── (auth)/           # Route group for authentication pages
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   └── profile/
├── (about)/          # Route group for about pages
│   ├── about/
│   ├── privacy/
│   └── terms/
├── globals.css       # Global styles
├── layout.tsx        # Root layout component
└── page.tsx          # Home page
```

## Key Patterns

### Route Groups
- Use parentheses `(groupName)` to organize routes without affecting the URL structure
- Groups allow sharing layouts and organizing related pages

### Layout Hierarchy
- `layout.tsx` - Root layout that wraps all pages
- Nested layouts can be created in subdirectories
- Layouts automatically apply to all pages in their directory tree

### Page Components
- `page.tsx` - Creates a route at that path
- Each page is a React Server Component by default
- Use dynamic routes with `[param]` syntax

### Example Usage
```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard Content</div>;
}

// app/users/[id]/page.tsx
export default function UserPage({ params }: { params: { id: string } }) {
  return <div>User: {params.id}</div>;
}
```

## Best Practices

1. Keep pages focused and lightweight
2. Use layouts for shared UI elements
3. Leverage route groups for organization
4. Follow Next.js App Router conventions
5. Use Server Components by default, Client Components when needed
