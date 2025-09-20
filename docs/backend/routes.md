# Backend Routes Documentation

## 🛣️ Complete API Routes Reference

This document provides a comprehensive reference for all API routes in the email provider platform.

## 📋 Route Categories

### 🔐 Authentication Routes (`/api/auth`)
```typescript
// User registration
POST   /api/auth/register
Body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}
Response: {
  success: boolean;
  user: User;
  token: string;
}

// User login
POST   /api/auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
}

// User logout
POST   /api/auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Refresh token
POST   /api/auth/refresh
Body: {
  refreshToken: string;
}
Response: {
  success: boolean;
  token: string;
}

// Forgot password
POST   /api/auth/forgot-password
Body: {
  email: string;
}
Response: {
  success: boolean;
  message: string;
}

// Reset password
POST   /api/auth/reset-password
Body: {
  token: string;
  password: string;
}
Response: {
  success: boolean;
  message: string;
}

// Get user profile
GET    /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  user: User;
}

// Update user profile
PUT    /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Body: {
  firstName?: string;
  lastName?: string;
  company?: string;
  preferences?: UserPreferences;
}
Response: {
  success: boolean;
  user: User;
}
```

### 📧 Email Routes (`/api/emails`)
```typescript
// Send single email
POST   /api/emails/send
Headers: { Authorization: "Bearer <token>" }
Body: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  provider?: string;
  from?: string;
  replyTo?: string;
  attachments?: Attachment[];
  variables?: Record<string, any>;
  trackOpens?: boolean;
  trackClicks?: boolean;
}
Response: {
  success: boolean;
  messageId: string;
  provider: string;
}

// Send bulk emails
POST   /api/emails/bulk
Headers: { Authorization: "Bearer <token>" }
Body: {
  recipients: BulkRecipient[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  provider?: string;
  from?: string;
  campaignName?: string;
  scheduledAt?: string;
}
Response: {
  success: boolean;
  campaignId: string;
  totalSent: number;
  totalFailed: number;
}

// Get email history
GET    /api/emails
Headers: { Authorization: "Bearer <token>" }
Query: {
  page?: number;
  limit?: number;
  status?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
Response: {
  success: boolean;
  emails: Email[];
  pagination: PaginationInfo;
}

// Get specific email
GET    /api/emails/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  email: Email;
}

// Delete email
DELETE /api/emails/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Test email configuration
POST   /api/emails/test
Headers: { Authorization: "Bearer <token>" }
Body: {
  provider: string;
  config?: ProviderConfig;
}
Response: {
  success: boolean;
  message: string;
  provider: string;
}
```

### 📝 Template Routes (`/api/templates`)
```typescript
// Get all templates
GET    /api/templates
Headers: { Authorization: "Bearer <token>" }
Query: {
  page?: number;
  limit?: number;
  category?: string;
  isPublic?: boolean;
  search?: string;
}
Response: {
  success: boolean;
  templates: Template[];
  pagination: PaginationInfo;
}

// Create template
POST   /api/templates
Headers: { Authorization: "Bearer <token>" }
Body: {
  name: string;
  description?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  provider?: string;
}
Response: {
  success: boolean;
  template: Template;
}

// Get specific template
GET    /api/templates/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  template: Template;
}

// Update template
PUT    /api/templates/:id
Headers: { Authorization: "Bearer <token>" }
Body: {
  name?: string;
  description?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}
Response: {
  success: boolean;
  template: Template;
}

// Delete template
DELETE /api/templates/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Preview template
POST   /api/templates/:id/preview
Headers: { Authorization: "Bearer <token>" }
Body: {
  variables?: Record<string, any>;
}
Response: {
  success: boolean;
  preview: {
    html: string;
    text: string;
  };
}

// Duplicate template
POST   /api/templates/:id/duplicate
Headers: { Authorization: "Bearer <token>" }
Body: {
  name: string;
}
Response: {
  success: boolean;
  template: Template;
}
```

### 📊 Campaign Routes (`/api/campaigns`)
```typescript
// Get all campaigns
GET    /api/campaigns
Headers: { Authorization: "Bearer <token>" }
Query: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
Response: {
  success: boolean;
  campaigns: Campaign[];
  pagination: PaginationInfo;
}

// Create campaign
POST   /api/campaigns
Headers: { Authorization: "Bearer <token>" }
Body: {
  name: string;
  description?: string;
  templateId?: number;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  recipients: CampaignRecipient[];
  scheduledAt?: string;
  settings?: CampaignSettings;
}
Response: {
  success: boolean;
  campaign: Campaign;
}

// Get specific campaign
GET    /api/campaigns/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  campaign: Campaign;
}

// Update campaign
PUT    /api/campaigns/:id
Headers: { Authorization: "Bearer <token>" }
Body: {
  name?: string;
  description?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  recipients?: CampaignRecipient[];
  scheduledAt?: string;
  settings?: CampaignSettings;
}
Response: {
  success: boolean;
  campaign: Campaign;
}

// Delete campaign
DELETE /api/campaigns/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Send campaign
POST   /api/campaigns/:id/send
Headers: { Authorization: "Bearer <token>" }
Body: {
  scheduledAt?: string;
  provider?: string;
}
Response: {
  success: boolean;
  message: string;
  campaign: Campaign;
}

// Pause campaign
POST   /api/campaigns/:id/pause
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Resume campaign
POST   /api/campaigns/:id/resume
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Get campaign analytics
GET    /api/campaigns/:id/analytics
Headers: { Authorization: "Bearer <token>" }
Query: {
  startDate?: string;
  endDate?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}
Response: {
  success: boolean;
  analytics: CampaignAnalytics;
}
```

### 🔌 Provider Routes (`/api/providers`)
```typescript
// Get all providers
GET    /api/providers
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  providers: EmailProvider[];
}

// Add new provider
POST   /api/providers
Headers: { Authorization: "Bearer <token>" }
Body: {
  name: string;
  type: 'sendgrid' | 'mailgun' | 'smtp';
  config: ProviderConfig;
  isPrimary?: boolean;
  priority?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
}
Response: {
  success: boolean;
  provider: EmailProvider;
}

// Get specific provider
GET    /api/providers/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  provider: EmailProvider;
}

// Update provider
PUT    /api/providers/:id
Headers: { Authorization: "Bearer <token>" }
Body: {
  name?: string;
  config?: ProviderConfig;
  isActive?: boolean;
  isPrimary?: boolean;
  priority?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
}
Response: {
  success: boolean;
  provider: EmailProvider;
}

// Delete provider
DELETE /api/providers/:id
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}

// Test provider
POST   /api/providers/:id/test
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
  responseTime?: number;
}

// Get provider statistics
GET    /api/providers/:id/stats
Headers: { Authorization: "Bearer <token>" }
Query: {
  startDate?: string;
  endDate?: string;
}
Response: {
  success: boolean;
  stats: ProviderStats;
}

// Set primary provider
POST   /api/providers/:id/primary
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  message: string;
}
```

### 📈 Analytics Routes (`/api/analytics`)
```typescript
// Get overview analytics
GET    /api/analytics/overview
Headers: { Authorization: "Bearer <token>" }
Query: {
  startDate?: string;
  endDate?: string;
  provider?: string;
}
Response: {
  success: boolean;
  overview: {
    totalEmails: number;
    sentEmails: number;
    failedEmails: number;
    successRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    trends: Trend[];
  };
}

// Get email analytics
GET    /api/analytics/emails
Headers: { Authorization: "Bearer <token>" }
Query: {
  startDate?: string;
  endDate?: string;
  provider?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}
Response: {
  success: boolean;
  analytics: {
    emails: EmailAnalytics[];
    performance: PerformanceMetrics;
  };
}

// Get campaign analytics
GET    /api/analytics/campaigns
Headers: { Authorization: "Bearer <token>" }
Query: {
  startDate?: string;
  endDate?: string;
}
Response: {
  success: boolean;
  campaigns: CampaignAnalytics[];
}

// Get provider analytics
GET    /api/analytics/providers
Headers: { Authorization: "Bearer <token>" }
Query: {
  startDate?: string;
  endDate?: string;
}
Response: {
  success: boolean;
  providers: ProviderAnalytics[];
}

// Generate reports
POST   /api/analytics/reports
Headers: { Authorization: "Bearer <token>" }
Body: {
  type: 'email' | 'campaign' | 'provider' | 'custom';
  startDate: string;
  endDate: string;
  format: 'pdf' | 'csv' | 'excel';
  includeCharts?: boolean;
  filters?: ReportFilters;
}
Response: {
  success: boolean;
  reportUrl: string;
  reportId: string;
}
```

### 🔗 Webhook Routes (`/api/webhooks`)
```typescript
// SendGrid webhooks
POST   /api/webhooks/sendgrid
Body: SendGridWebhookEvent[]
Response: {
  success: boolean;
  processed: number;
}

// Mailgun webhooks
POST   /api/webhooks/mailgun
Body: MailgunWebhookEvent[]
Response: {
  success: boolean;
  processed: number;
}

// Generic webhook handler
POST   /api/webhooks/generic
Headers: { 'X-Provider': string }
Body: any
Response: {
  success: boolean;
  processed: number;
}

// Get webhook events
GET    /api/webhooks/events
Headers: { Authorization: "Bearer <token>" }
Query: {
  page?: number;
  limit?: number;
  provider?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
}
Response: {
  success: boolean;
  events: WebhookEvent[];
  pagination: PaginationInfo;
}
```

### ⚙️ Settings Routes (`/api/settings`)
```typescript
// Get user settings
GET    /api/settings
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  settings: UserSettings;
}

// Update user settings
PUT    /api/settings
Headers: { Authorization: "Bearer <token>" }
Body: {
  preferences?: UserPreferences;
  notifications?: NotificationSettings;
  security?: SecuritySettings;
}
Response: {
  success: boolean;
  settings: UserSettings;
}

// Get notification preferences
GET    /api/settings/notifications
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: boolean;
  notifications: NotificationSettings;
}

// Update notification preferences
PUT    /api/settings/notifications
Headers: { Authorization: "Bearer <token>" }
Body: NotificationSettings
Response: {
  success: boolean;
  notifications: NotificationSettings;
}
```

### 🤖 AI Routes (`/api/ai`)
```typescript
// Generate email content
POST   /api/ai/generate-content
Headers: { Authorization: "Bearer <token>" }
Body: {
  type: 'welcome' | 'follow-up' | 'newsletter' | 'promotional' | 'support';
  recipient: string;
  context: string;
  tone: 'formal' | 'casual' | 'friendly' | 'professional';
  length: 'short' | 'medium' | 'long';
  keyPoints: string[];
  callToAction?: string;
}
Response: {
  success: boolean;
  content: {
    subject: string;
    body: string;
    htmlBody: string;
    plainTextBody: string;
    confidence: number;
    tone: string;
  };
}

// Analyze email content
POST   /api/ai/analyze-content
Headers: { Authorization: "Bearer <token>" }
Body: {
  content: string;
  type: 'sentiment' | 'tone' | 'readability' | 'optimization';
}
Response: {
  success: boolean;
  analysis: ContentAnalysis;
}

// Predict email success
POST   /api/ai/predict-success
Headers: { Authorization: "Bearer <token>" }
Body: {
  subject: string;
  content: string;
  recipient: string;
  sendTime?: string;
}
Response: {
  success: boolean;
  prediction: {
    successProbability: number;
    confidence: number;
    keyFactors: string[];
    suggestions: string[];
  };
}

// Generate template
POST   /api/ai/generate-template
Headers: { Authorization: "Bearer <token>" }
Body: {
  industry: string;
  audience: string;
  goal: string;
  style: 'modern' | 'classic' | 'creative' | 'minimalist';
  components: string[];
}
Response: {
  success: boolean;
  template: {
    name: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    category: string;
  };
}
```

### 👥 Admin Routes (`/api/admin`)
```typescript
// Get all users (admin only)
GET    /api/admin/users
Headers: { Authorization: "Bearer <admin-token>" }
Query: {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  search?: string;
}
Response: {
  success: boolean;
  users: User[];
  pagination: PaginationInfo;
}

// Get user details (admin only)
GET    /api/admin/users/:id
Headers: { Authorization: "Bearer <admin-token>" }
Response: {
  success: boolean;
  user: User;
  stats: UserStats;
}

// Update user (admin only)
PUT    /api/admin/users/:id
Headers: { Authorization: "Bearer <admin-token>" }
Body: {
  status?: string;
  role?: string;
  limits?: UserLimits;
}
Response: {
  success: boolean;
  user: User;
}

// Get system statistics (admin only)
GET    /api/admin/stats
Headers: { Authorization: "Bearer <admin-token>" }
Query: {
  startDate?: string;
  endDate?: string;
}
Response: {
  success: boolean;
  stats: SystemStats;
}

// Get system logs (admin only)
GET    /api/admin/logs
Headers: { Authorization: "Bearer <admin-token>" }
Query: {
  level?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
Response: {
  success: boolean;
  logs: SystemLog[];
  pagination: PaginationInfo;
}
```

## 📊 Response Types

### Common Response Structure
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}
```

### Data Models
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Email {
  id: number;
  userId: number;
  recipient: string;
  subject: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  provider: string;
  messageId?: string;
  sentAt?: Date;
  createdAt: Date;
}

interface Template {
  id: number;
  userId: number;
  name: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  category?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Campaign {
  id: number;
  userId: number;
  name: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';
  recipientCount: number;
  successCount: number;
  failureCount: number;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface EmailProvider {
  id: number;
  userId: number;
  name: string;
  type: 'sendgrid' | 'mailgun' | 'smtp';
  isActive: boolean;
  isPrimary: boolean;
  priority: number;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Authentication & Authorization

### Authentication Headers
```typescript
// All protected routes require:
Headers: {
  Authorization: "Bearer <jwt-token>"
}

// Admin routes require:
Headers: {
  Authorization: "Bearer <admin-jwt-token>"
}
```

### Rate Limiting
```typescript
// Rate limits by endpoint type:
const rateLimits = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 },      // 5 requests per 15 minutes
  api: { windowMs: 60 * 1000, max: 100 },          // 100 requests per minute
  email: { windowMs: 60 * 1000, max: 10 },         // 10 emails per minute
  bulk: { windowMs: 60 * 60 * 1000, max: 1000 },   // 1000 bulk emails per hour
  ai: { windowMs: 60 * 1000, max: 20 },            // 20 AI requests per minute
};
```

## 📝 Error Codes

### Common Error Codes
```typescript
enum ErrorCodes {
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_LIMIT_EXCEEDED = 'RESOURCE_LIMIT_EXCEEDED',
  
  // Provider errors
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  PROVIDER_UNAVAILABLE = 'PROVIDER_UNAVAILABLE',
  PROVIDER_QUOTA_EXCEEDED = 'PROVIDER_QUOTA_EXCEEDED',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}
```
