# Styles Directory

This directory contains global CSS files and styling utilities for the application.

## Structure

```
styles/
├── auth.css            # Authentication-specific styles
├── colors.css          # Color palette and CSS custom properties
├── components.css      # Component-specific styles
├── index.css          # Main stylesheet imports
├── theme-switcher.css  # Theme switching styles
└── typography.css     # Typography styles and font definitions
```

## File Organization

### 1. Main Stylesheet (`index.css`)
Central import file that combines all stylesheets:
```css
@import './colors.css';
@import './typography.css';
@import './components.css';
@import './theme-switcher.css';
@import './auth.css';
```

### 2. Color System (`colors.css`)
CSS custom properties for consistent theming:
```css
:root {
  /* Primary Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-900: #111827;
}
```

### 3. Typography (`typography.css`)
Font definitions and text styling:
```css
/* Font Families */
.font-heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
}

.font-body {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 400;
}

/* Typography Scale */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
```

### 4. Components (`components.css`)
Global component styles and utilities:
```css
/* Button Base Styles */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary-500 text-white hover:bg-primary-600;
}

/* Form Styles */
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500;
}

/* Card Styles */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
```

### 5. Theme Switcher (`theme-switcher.css`)
Dark/light mode transition styles:
```css
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --border-primary: #374151;
}
```

### 6. Authentication Styles (`auth.css`)
Auth-specific component styles:
```css
.auth-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50;
}

.auth-card {
  @apply w-full max-w-md bg-white rounded-lg shadow-md p-8;
}

.auth-form {
  @apply space-y-6;
}
```

## Styling Patterns

### 1. CSS Custom Properties
Use CSS custom properties for consistent theming:
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### 2. Utility Classes
Create utility classes for common patterns:
```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 3. Component-Specific Styles
Keep component styles in separate files when they're complex:
```css
/* components/Button/Button.css */
.button {
  /* Component-specific styles */
}

.button--variant-primary {
  /* Variant styles */
}
```

## Best Practices

### 1. Organization
- Keep global styles in this directory
- Use component-specific CSS files for complex components
- Import styles in the main `index.css` file

### 2. Naming Conventions
- Use BEM methodology for component classes
- Use kebab-case for utility classes
- Use semantic names for CSS custom properties

### 3. Responsive Design
```css
/* Mobile-first approach */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### 4. Performance
- Use CSS custom properties for dynamic values
- Minimize CSS specificity conflicts
- Use efficient selectors

### 5. Accessibility
```css
/* Focus styles */
.focusable:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Integration with Tailwind CSS

If using Tailwind CSS, organize your styles to work alongside it:

```css
/* Custom components that extend Tailwind */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## Adding New Styles

1. **Global Styles**: Add to appropriate file in this directory
2. **Component Styles**: Create `ComponentName.css` in component folder
3. **Utility Classes**: Add to `components.css` or create new utility file
4. **Theme Variables**: Add to `colors.css` or create theme-specific file
5. **Import**: Add import to `index.css` if creating new file
