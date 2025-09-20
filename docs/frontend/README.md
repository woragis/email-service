# Frontend Documentation

## 🏗️ Architecture Overview

The frontend follows a component-based architecture with clean separation of concerns that can be implemented with any modern web framework.

```
src/
├── components/           # Reusable UI components
├── pages/               # Page components
├── layouts/             # Layout components
├── hooks/               # Custom framework hooks
├── services/            # API services
├── store/               # State management
├── utils/               # Utility functions
├── types/               # Type definitions
├── assets/              # Static assets
└── styles/              # Global styles
```

## 🛣️ Page Organization & Routing

### Route Structure
```
Main Application Routes:
/ (with Layout)
├── / → Dashboard
├── /emails → Email Management
├── /templates → Template Management
├── /campaigns → Campaign Management
├── /analytics → Analytics Dashboard
├── /providers → Provider Management
└── /settings → User Settings

Authentication Routes (/auth):
├── /login → Login Page
├── /register → Registration Page
├── /forgot-password → Password Reset Request
└── /reset-password → Password Reset Form

Admin Routes (/admin):
├── /users → User Management
├── /system → System Settings
└── /logs → System Logs
```

### Page Components

#### 1. Dashboard (`/`)
**Props:**
- user: User object
- stats: Dashboard statistics
- recentEmails: Array of recent emails
- upcomingCampaigns: Array of scheduled campaigns

**Features:**
- Email statistics overview
- Recent email activity
- Quick actions (send email, create campaign)
- Provider status indicators
- Usage quota display

#### 2. Email Management (`/emails`)
**Props:**
- emails: Array of email objects
- filters: Email filter options
- pagination: Pagination state

**Features:**
- Email list with filters
- Send new email form
- Email history with search
- Bulk operations
- Email preview

#### 3. Template Management (`/templates`)
**Props:**
- templates: Array of template objects
- categories: Array of template categories
- selectedTemplate: Currently selected template (optional)

**Features:**
- Template gallery
- Template editor (WYSIWYG)
- Template categories
- Import/export templates
- Template versioning

#### 4. Campaign Management (`/campaigns`)
**Props:**
- campaigns: Array of campaign objects
- campaignStats: Array of campaign statistics
- selectedCampaign: Currently selected campaign (optional)

**Features:**
- Campaign list and status
- Campaign builder
- Audience segmentation
- Scheduling
- A/B testing

#### 5. Analytics Dashboard (`/analytics`)
**Props:**
- analyticsData: Analytics data object
- dateRange: Selected date range
- selectedMetrics: Array of selected metrics

**Features:**
- Real-time analytics
- Interactive charts
- Email performance metrics
- Provider comparison
- Export reports

#### 6. Provider Management (`/providers`)
**Props:**
- providers: Array of email provider objects
- providerStats: Array of provider statistics
- activeProvider: Currently active provider (optional)

**Features:**
- Provider configuration
- Connection testing
- Provider statistics
- Failover settings
- API key management

## 🧩 Component Architecture

### Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar
│   │   ├── NavigationMenu
│   │   └── QuickActions
│   └── MainContent
│       └── PageContent
├── AuthLayout
│   ├── AuthHeader
│   └── AuthForm
└── AdminLayout
    ├── AdminHeader
    ├── AdminSidebar
    └── AdminContent
```

### Reusable Components

#### 1. Email Components
**EmailForm** - Send email form
- onSubmit: Function to handle form submission
- initialData: Initial form data (optional)
- templateOptions: Available templates (optional)

**EmailList** - Display list of emails
- emails: Array of email objects
- onSelect: Function called when email is selected
- onDelete: Function called when email is deleted
- filters: Email filter options

**EmailPreview** - Preview email content
- email: Email object to preview
- showHeaders: Whether to show email headers (optional)
- onEdit: Function called when edit is requested (optional)

#### 2. Template Components
**TemplateEditor** - WYSIWYG template editor
- template: Template object to edit
- onChange: Function called when template changes
- onSave: Function called when template is saved

**TemplateGallery** - Template selection
- templates: Array of template objects
- categories: Array of category names
- onSelect: Function called when template is selected
- onCreateNew: Function called when creating new template

#### 3. Analytics Components
**MetricsCard** - Display metric value
- title: Metric title string
- value: Metric value (string or number)
- change: Percentage change (optional)
- trend: Trend direction 'up', 'down', or 'stable' (optional)
- icon: Icon component (optional)

**ChartComponent** - Generic chart wrapper
- data: Chart data object
- type: Chart type 'line', 'bar', 'pie', or 'area'
- options: Chart configuration options (optional)
- height: Chart height in pixels (optional)

#### 4. Form Components
**FormField** - Generic form field
- label: Field label string
- name: Field name string
- type: Field type 'text', 'email', 'password', 'textarea', or 'select'
- value: Current field value
- onChange: Function called when value changes
- error: Error message string (optional)
- required: Whether field is required (optional)

**Modal** - Generic modal component
- isOpen: Whether modal is open (boolean)
- onClose: Function called when modal is closed
- title: Modal title string
- children: Modal content
- size: Modal size 'sm', 'md', 'lg', or 'xl' (optional)

## 🎨 UI/UX Design System

### Design Tokens
**Colors:**
```
Primary Colors:
- 50: #eff6ff
- 500: #3b82f6
- 900: #1e3a8a

Secondary Colors:
- 50: #f8fafc
- 500: #64748b
- 900: #0f172a

Semantic Colors:
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444
```

**Typography:**
```
Font Families:
- Sans: Inter, system-ui, sans-serif
- Mono: JetBrains Mono, monospace

Font Sizes:
- xs: 0.75rem
- sm: 0.875rem
- base: 1rem
- lg: 1.125rem
- xl: 1.25rem
```

**Spacing:**
```
Spacing Scale:
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
```

### Component Variants
**Button Variants:**
- variant: 'primary', 'secondary', 'outline', or 'ghost'
- size: 'sm', 'md', or 'lg'
- disabled: boolean (optional)
- loading: boolean (optional)
- children: button content

**Input Variants:**
- variant: 'default', 'filled', or 'outline'
- size: 'sm', 'md', or 'lg'
- state: 'default', 'error', 'success', or 'warning'

## 📱 Responsive Design

### Breakpoints
```
Breakpoint Definitions:
- sm: 640px (Mobile landscape)
- md: 768px (Tablet)
- lg: 1024px (Desktop)
- xl: 1280px (Large desktop)
- 2xl: 1536px (Extra large desktop)
```

### Responsive Components
**Responsive Layout Structure:**
- Mobile: Stack layout (vertical)
- Desktop: Sidebar + main content (horizontal)
- Sidebar width: 256px on desktop
- Main content: Flexible width

## 🔄 State Management

### State Management Structure
**Root State:**
- auth: Authentication state
- emails: Email management state
- templates: Template management state
- campaigns: Campaign management state
- analytics: Analytics data state
- providers: Provider configuration state
- ui: User interface state

**Authentication State:**
- user: User object or null
- token: JWT token or null
- isAuthenticated: boolean
- loading: boolean
- error: error message or null

**Email State:**
- emails: Array of email objects
- selectedEmail: Currently selected email or null
- filters: Email filter options
- pagination: Pagination state
- loading: boolean
- error: error message or null

### Custom Hooks
**useEmail Hook:**
- Returns: emails, loading, error, sendEmail function
- Manages email state and provides email sending functionality
- Handles async email operations

**useAnalytics Hook:**
- Parameters: dateRange object
- Returns: data, loading state
- Fetches analytics data for specified date range
- Manages loading state during data fetching

## 🧪 Testing Strategy

### Test Structure
```
tests/
├── components/          # Component tests
├── pages/              # Page tests
├── hooks/              # Custom hook tests
├── utils/              # Utility tests
├── integration/        # Integration tests
└── e2e/                # End-to-end tests
```

### Testing Tools
- **Unit Testing Framework** - Choose your preferred framework
- **Component Testing Library** - Framework-specific testing utilities
- **E2E Testing** - End-to-end testing framework
- **API Mocking** - Mock API responses for testing

### Test Examples
**Component Test Example:**
- Test email form submission with valid data
- Mock form submission handler
- Simulate user input and form submission
- Verify handler is called with correct data

**Integration Test Example:**
- Test complete email sending flow
- Mock API endpoints
- Verify email is sent and UI updates correctly

## 🚀 Performance Optimization

### Code Splitting
**Lazy Loading:**
- Load pages/components on demand
- Split code by routes or features
- Reduce initial bundle size

**Route-based Splitting:**
- Split code by application routes
- Load components when routes are accessed
- Show loading states during code loading

### Memoization
**Component Memoization:**
- Memoize components that receive stable props
- Prevent unnecessary re-renders
- Improve performance for list components

**Selector Memoization:**
- Memoize expensive computations
- Cache filtered or transformed data
- Optimize state selection performance

## 📦 Build & Deployment

### Build Configuration
**Build Optimization:**
- Code splitting by vendor libraries
- Separate chunks for framework code
- UI component library chunking
- Asset optimization and minification

**Bundle Splitting:**
- Vendor chunk: Framework dependencies
- UI chunk: UI component libraries
- Feature chunks: Route-based splitting

### Environment Configuration
```
Environment Variables:
- API_URL: Backend API endpoint
- APP_NAME: Application name
- SENTRY_DSN: Error tracking (optional)
- ANALYTICS_ID: Analytics tracking (optional)
```
