# Database Documentation

## 🏗️ Database Architecture

The application uses PostgreSQL as the primary database with Redis for caching and session management.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │      Redis      │    │   File Storage  │
│   (Primary DB)  │    │    (Cache)      │    │   (Assets)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Database Schema

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Email Providers Table
```sql
CREATE TABLE email_providers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'sendgrid', 'mailgun', 'smtp'
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    daily_limit INTEGER DEFAULT 1000,
    monthly_limit INTEGER DEFAULT 30000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Email Templates Table
```sql
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(500),
    html_content TEXT,
    text_content TEXT,
    template_id VARCHAR(255), -- Provider-specific template ID
    provider VARCHAR(50),
    category VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Email Campaigns Table
```sql
CREATE TABLE email_campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES email_templates(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'paused', 'failed'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    completed_at TIMESTAMP,
    recipient_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Email Recipients Table
```sql
CREATE TABLE email_recipients (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    variables JSONB, -- Dynamic template variables
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced', 'opened', 'clicked'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    error_message TEXT,
    message_id VARCHAR(255),
    provider_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Email Logs Table
```sql
CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    provider_used VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed'
    message_id VARCHAR(255),
    error_message TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. API Usage Table
```sql
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    request_count INTEGER DEFAULT 0,
    email_count INTEGER DEFAULT 0,
    bulk_email_count INTEGER DEFAULT 0,
    template_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);
```

#### 8. Webhook Events Table
```sql
CREATE TABLE webhook_events (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    message_id VARCHAR(255),
    recipient_email VARCHAR(255),
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. User Settings Table
```sql
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferences JSONB DEFAULT '{}',
    notifications JSONB DEFAULT '{}',
    security_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. System Logs Table
```sql
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL, -- 'debug', 'info', 'warn', 'error'
    message TEXT NOT NULL,
    context JSONB,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 Relationships & Constraints

### Foreign Key Relationships
```sql
-- Users -> Email Providers (1:many)
ALTER TABLE email_providers ADD CONSTRAINT fk_email_providers_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Users -> Email Templates (1:many)
ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Email Templates -> Email Campaigns (1:many)
ALTER TABLE email_campaigns ADD CONSTRAINT fk_email_campaigns_template 
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

-- Users -> Email Campaigns (1:many)
ALTER TABLE email_campaigns ADD CONSTRAINT fk_email_campaigns_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Email Campaigns -> Email Recipients (1:many)
ALTER TABLE email_recipients ADD CONSTRAINT fk_email_recipients_campaign 
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE;
```

### Indexes for Performance
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Email providers indexes
CREATE INDEX idx_email_providers_user_id ON email_providers(user_id);
CREATE INDEX idx_email_providers_active ON email_providers(is_active);
CREATE INDEX idx_email_providers_primary ON email_providers(is_primary);

-- Email templates indexes
CREATE INDEX idx_email_templates_user_id ON email_templates(user_id);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_public ON email_templates(is_public);

-- Email campaigns indexes
CREATE INDEX idx_email_campaigns_user_id ON email_campaigns(user_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);

-- Email recipients indexes
CREATE INDEX idx_email_recipients_campaign_id ON email_recipients(campaign_id);
CREATE INDEX idx_email_recipients_email ON email_recipients(email);
CREATE INDEX idx_email_recipients_status ON email_recipients(status);
CREATE INDEX idx_email_recipients_sent_at ON email_recipients(sent_at);

-- Email logs indexes
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_provider ON email_logs(provider_used);

-- API usage indexes
CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, date);
CREATE INDEX idx_api_usage_date ON api_usage(date);

-- Webhook events indexes
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);
```

## 🗃️ Data Models

### TypeScript Interfaces

#### User Model
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
  providers?: EmailProvider[];
  settings?: UserSettings;
}
```

#### Email Provider Model
```typescript
interface EmailProvider {
  id: number;
  userId: number;
  name: string;
  type: 'sendgrid' | 'mailgun' | 'smtp';
  config: ProviderConfig;
  isActive: boolean;
  isPrimary: boolean;
  priority: number;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProviderConfig {
  sendgrid?: {
    apiKey: string;
    fromEmail: string;
    templateIds?: Record<string, string>;
  };
  mailgun?: {
    apiKey: string;
    domain: string;
    fromEmail: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}
```

#### Email Template Model
```typescript
interface EmailTemplate {
  id: number;
  userId: number;
  name: string;
  description?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  provider?: string;
  category?: string;
  tags: string[];
  isPublic: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Email Campaign Model
```typescript
interface EmailCampaign {
  id: number;
  userId: number;
  templateId?: number;
  name: string;
  description?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  completedAt?: Date;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  bounceCount: number;
  openCount: number;
  clickCount: number;
  settings: CampaignSettings;
  createdAt: Date;
  updatedAt: Date;
  recipients?: EmailRecipient[];
}

interface CampaignSettings {
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  trackOpens: boolean;
  trackClicks: boolean;
  unsubscribeLink: boolean;
  testMode: boolean;
}
```

#### Email Recipient Model
```typescript
interface EmailRecipient {
  id: number;
  campaignId: number;
  email: string;
  name?: string;
  variables: Record<string, any>;
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  errorMessage?: string;
  messageId?: string;
  providerUsed?: string;
  createdAt: Date;
}
```

## 🔄 Database Migrations

### Migration Structure
```
migrations/
├── 001_create_users_table.sql
├── 002_create_email_providers_table.sql
├── 003_create_email_templates_table.sql
├── 004_create_email_campaigns_table.sql
├── 005_create_email_recipients_table.sql
├── 006_create_email_logs_table.sql
├── 007_create_api_usage_table.sql
├── 008_create_webhook_events_table.sql
├── 009_create_user_settings_table.sql
├── 010_create_system_logs_table.sql
├── 011_add_indexes.sql
└── 012_seed_initial_data.sql
```

### Example Migration
```sql
-- Migration: 001_create_users_table.sql
-- Description: Create users table with authentication fields

BEGIN;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

COMMIT;
```

## 🌱 Database Seeding

### Seed Data Structure
```sql
-- Insert default email providers
INSERT INTO email_providers (name, type, config, is_active, priority) VALUES
('SendGrid', 'sendgrid', '{"host": "smtp.sendgrid.net", "port": 587, "secure": false}', true, 1),
('Mailgun', 'mailgun', '{"host": "smtp.mailgun.org", "port": 587, "secure": false}', true, 2),
('SMTP', 'smtp', '{"host": "localhost", "port": 587, "secure": false}', false, 3);

-- Insert default email templates
INSERT INTO email_templates (user_id, name, subject, html_content, category, is_public) VALUES
(1, 'Welcome Email', 'Welcome to our service!', '<h1>Welcome!</h1><p>Thank you for joining us.</p>', 'welcome', true),
(1, 'Password Reset', 'Reset your password', '<h1>Password Reset</h1><p>Click the link to reset your password.</p>', 'authentication', true),
(1, 'Newsletter', 'Weekly Newsletter', '<h1>Weekly Update</h1><p>Here are this week''s highlights.</p>', 'newsletter', true);
```

## 🔍 Query Optimization

### Common Queries

#### 1. User Dashboard Stats
```sql
SELECT 
    COUNT(*) as total_emails,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_emails,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_emails,
    AVG(CASE WHEN status = 'sent' THEN 1.0 ELSE 0.0 END) * 100 as success_rate
FROM email_logs 
WHERE user_id = $1 
AND created_at >= CURRENT_DATE - INTERVAL '30 days';
```

#### 2. Campaign Performance
```sql
SELECT 
    c.name,
    c.recipient_count,
    c.success_count,
    c.failure_count,
    c.open_count,
    c.click_count,
    ROUND((c.success_count::float / c.recipient_count * 100), 2) as delivery_rate,
    ROUND((c.open_count::float / c.success_count * 100), 2) as open_rate,
    ROUND((c.click_count::float / c.open_count * 100), 2) as click_rate
FROM email_campaigns c
WHERE c.user_id = $1
ORDER BY c.created_at DESC;
```

#### 3. Provider Performance
```sql
SELECT 
    provider_used,
    COUNT(*) as total_emails,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful_emails,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_emails,
    ROUND(AVG(CASE WHEN status = 'sent' THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
FROM email_logs 
WHERE user_id = $1 
AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY provider_used
ORDER BY success_rate DESC;
```

## 🔒 Security & Access Control

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE email_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user isolation
CREATE POLICY user_isolation_providers ON email_providers
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user_id')::int);

CREATE POLICY user_isolation_templates ON email_templates
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user_id')::int OR is_public = true);

CREATE POLICY user_isolation_campaigns ON email_campaigns
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user_id')::int);

CREATE POLICY user_isolation_logs ON email_logs
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user_id')::int);
```

## 📊 Backup & Recovery

### Backup Strategy
```bash
# Daily full backup
pg_dump -h localhost -U username -d email_provider > backup_$(date +%Y%m%d).sql

# Incremental backup (WAL archiving)
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'

# Point-in-time recovery
pg_basebackup -h localhost -U username -D /backup/base -Ft -z -P
```

### Monitoring Queries
```sql
-- Database size monitoring
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage monitoring
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;
```
