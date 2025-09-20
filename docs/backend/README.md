# Backend Documentation

## 🏗️ Architecture Overview

The backend follows a modular architecture pattern that can be implemented in any modern programming language and framework.

```
src/
├── controllers/          # Request handlers
├── services/            # Business logic
├── models/              # Database models
├── middleware/          # Framework middleware
├── routes/              # API routes
├── utils/               # Utility functions
├── config/              # Configuration files
├── types/               # Type definitions
└── tests/               # Test files
```

## 🛣️ API Routes & Endpoints

### Authentication Routes
```
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login
POST   /api/auth/logout             # User logout
POST   /api/auth/refresh            # Refresh token
POST   /api/auth/forgot-password    # Password reset request
POST   /api/auth/reset-password     # Password reset confirmation
GET    /api/auth/profile            # Get user profile
PUT    /api/auth/profile            # Update user profile
```

### Email Routes
```
POST   /api/emails/send             # Send single email
POST   /api/emails/bulk             # Send bulk emails
GET    /api/emails                  # Get email history
GET    /api/emails/:id              # Get specific email
DELETE /api/emails/:id              # Delete email
POST   /api/emails/test             # Test email configuration
```

### Template Routes
```
GET    /api/templates               # Get all templates
POST   /api/templates               # Create template
GET    /api/templates/:id           # Get specific template
PUT    /api/templates/:id           # Update template
DELETE /api/templates/:id           # Delete template
POST   /api/templates/:id/preview   # Preview template
```

### Campaign Routes
```
GET    /api/campaigns               # Get all campaigns
POST   /api/campaigns               # Create campaign
GET    /api/campaigns/:id           # Get specific campaign
PUT    /api/campaigns/:id           # Update campaign
DELETE /api/campaigns/:id           # Delete campaign
POST   /api/campaigns/:id/send      # Send campaign
GET    /api/campaigns/:id/analytics # Campaign analytics
```

### Provider Routes
```
GET    /api/providers               # Get all providers
POST   /api/providers               # Add new provider
GET    /api/providers/:id           # Get specific provider
PUT    /api/providers/:id           # Update provider
DELETE /api/providers/:id           # Delete provider
POST   /api/providers/:id/test      # Test provider
GET    /api/providers/:id/stats     # Provider statistics
```

### Analytics Routes
```
GET    /api/analytics/overview      # Overview analytics
GET    /api/analytics/emails        # Email analytics
GET    /api/analytics/campaigns     # Campaign analytics
GET    /api/analytics/providers     # Provider analytics
GET    /api/analytics/reports       # Generate reports
```

### Webhook Routes
```
POST   /api/webhooks/sendgrid       # SendGrid webhooks
POST   /api/webhooks/mailgun        # Mailgun webhooks
POST   /api/webhooks/generic        # Generic webhook handler
GET    /api/webhooks/events         # Get webhook events
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```
JWT Payload:
- userId: string
- email: string
- role: 'user' | 'admin' | 'enterprise'
- permissions: array of strings
- issuedAt: timestamp
- expiresAt: timestamp
```

### Middleware Chain
1. **CORS Middleware** - Handle cross-origin requests
2. **Rate Limiting** - Prevent API abuse
3. **Authentication** - Verify JWT tokens
4. **Authorization** - Check user permissions
5. **Request Validation** - Validate request data
6. **Logging** - Log requests and responses

### Permission System
```
Permissions:
- email:send
- email:read
- email:delete
- template:create
- template:read
- template:update
- template:delete
- campaign:create
- campaign:read
- campaign:update
- campaign:delete
- analytics:read
- provider:manage
- user:manage
```

## 📧 Email Provider Integrations

### Provider Interface
```
EmailProvider:
- name: string
- type: 'smtp' | 'api'
- sendEmail(options): Promise<EmailResult>
- sendTemplate(templateId, recipient, data): Promise<EmailResult>
- testConnection(): Promise<boolean>
- getStats(): Promise<ProviderStats>
```

### Supported Providers
- **SendGrid** - API-based with template support
- **Mailgun** - API-based with webhook support
- **SMTP** - Generic SMTP server support
- **Amazon SES** - AWS Simple Email Service
- **Postmark** - Transactional email service

### Provider Configuration
```
SendGrid Config:
- apiKey: string
- fromEmail: string
- templateIds: map<string, string>

Mailgun Config:
- apiKey: string
- domain: string
- fromEmail: string

SMTP Config:
- host: string
- port: number
- secure: boolean
- auth:
  - user: string
  - pass: string
```

## 🛡️ Security & Rate Limiting

### Rate Limiting Strategy
```
Rate Limits:
- Authentication: 5 attempts per 15 minutes
- General API: 100 requests per minute
- Email sending: 10 emails per minute
- Bulk emails: 1000 emails per hour
- AI requests: 20 requests per minute
```

### Security Headers
```
Security Headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security
- Referrer-Policy
```

## 🔄 Webhooks & Event Handling

### Webhook Event Structure
```
WebhookEvent:
- id: string
- type: 'email_sent' | 'email_delivered' | 'email_opened' | 'email_clicked' | 'email_bounced'
- provider: string
- messageId: string
- recipient: string
- timestamp: datetime
- data: object
```

### Event Queue System
- **Message Queue** (Redis/RabbitMQ) for webhook processing
- **Event Sourcing** for audit trails
- **Real-time Updates** via WebSocket/Server-Sent Events

## 🧪 Testing Strategy

### Test Structure
```
tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
├── e2e/                  # End-to-end tests
├── fixtures/             # Test data
└── helpers/              # Test utilities
```

### Test Coverage
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows
- **Load Tests**: Performance benchmarks

## 📊 Monitoring & Logging

### Log Entry Structure
```
LogEntry:
- timestamp: datetime
- level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
- message: string
- context:
  - userId: string (optional)
  - requestId: string
  - endpoint: string (optional)
  - method: string (optional)
- metadata: object (optional)
```

### Monitoring Metrics
- **API Response Times**
- **Email Delivery Rates**
- **Error Rates**
- **Provider Performance**
- **User Activity**
- **System Resource Usage**

## 🚀 Deployment

### Environment Configuration
```
Environment Variables:
- ENV: 'development' | 'staging' | 'production'
- PORT: number
- DATABASE_URL: string
- REDIS_URL: string
- JWT_SECRET: string
- ENCRYPTION_KEY: string
- PROVIDER_CONFIGS: JSON object
```

### Container Configuration
```
Container Requirements:
- Base image for your chosen language/runtime
- Application code
- Dependencies installation
- Build process (if needed)
- Port exposure
- Health checks
```

## 📚 API Documentation

### OpenAPI Specification
- **Swagger UI** at `/api/docs`
- **Postman Collection** available
- **SDK Generation** for multiple languages

### Request/Response Examples
See individual route documentation for detailed examples and schemas.
