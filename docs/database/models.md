# Database Models Documentation

## 📊 Complete Database Schema

This document provides a comprehensive reference for all database models, relationships, and constraints in the email provider platform.

## 🗃️ Core Models

### 1. Users Model
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token);
```

### 2. Email Providers Model
```sql
CREATE TABLE email_providers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'sendgrid', 'mailgun', 'smtp', 'ses', 'postmark'
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    daily_limit INTEGER DEFAULT 1000,
    monthly_limit INTEGER DEFAULT 30000,
    yearly_limit INTEGER DEFAULT 365000,
    current_daily_count INTEGER DEFAULT 0,
    current_monthly_count INTEGER DEFAULT 0,
    current_yearly_count INTEGER DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_response_time INTEGER DEFAULT 0, -- in milliseconds
    last_used TIMESTAMP,
    last_tested TIMESTAMP,
    test_result BOOLEAN,
    error_count INTEGER DEFAULT 0,
    last_error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_provider_name UNIQUE(user_id, name),
    CONSTRAINT valid_priority CHECK (priority >= 1 AND priority <= 10),
    CONSTRAINT valid_limits CHECK (daily_limit > 0 AND monthly_limit > 0 AND yearly_limit > 0)
);

-- Indexes
CREATE INDEX idx_email_providers_user_id ON email_providers(user_id);
CREATE INDEX idx_email_providers_active ON email_providers(is_active);
CREATE INDEX idx_email_providers_primary ON email_providers(is_primary);
CREATE INDEX idx_email_providers_type ON email_providers(type);
CREATE INDEX idx_email_providers_priority ON email_providers(priority);
CREATE INDEX idx_email_providers_last_used ON email_providers(last_used);
```

### 3. Email Templates Model
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
    is_featured BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    parent_template_id INTEGER REFERENCES email_templates(id),
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_open_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_click_rate DECIMAL(5,2) DEFAULT 0.00,
    thumbnail_url VARCHAR(500),
    preview_url VARCHAR(500),
    variables JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_template_name UNIQUE(user_id, name),
    CONSTRAINT valid_version CHECK (version >= 1)
);

-- Indexes
CREATE INDEX idx_email_templates_user_id ON email_templates(user_id);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_public ON email_templates(is_public);
CREATE INDEX idx_email_templates_featured ON email_templates(is_featured);
CREATE INDEX idx_email_templates_tags ON email_templates USING GIN(tags);
CREATE INDEX idx_email_templates_usage_count ON email_templates(usage_count);
CREATE INDEX idx_email_templates_parent ON email_templates(parent_template_id);
```

### 4. Email Campaigns Model
```sql
CREATE TABLE email_campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES email_templates(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'paused', 'failed', 'cancelled'
    type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'automated', 'triggered', 'a_b_test'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    completed_at TIMESTAMP,
    paused_at TIMESTAMP,
    recipient_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    forward_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}',
    a_b_test_config JSONB,
    automation_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_recipient_count CHECK (recipient_count >= 0),
    CONSTRAINT valid_success_count CHECK (success_count >= 0 AND success_count <= recipient_count),
    CONSTRAINT valid_failure_count CHECK (failure_count >= 0 AND failure_count <= recipient_count)
);

-- Indexes
CREATE INDEX idx_email_campaigns_user_id ON email_campaigns(user_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_type ON email_campaigns(type);
CREATE INDEX idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);
CREATE INDEX idx_email_campaigns_sent_at ON email_campaigns(sent_at);
CREATE INDEX idx_email_campaigns_template_id ON email_campaigns(template_id);
```

### 5. Email Recipients Model
```sql
CREATE TABLE email_recipients (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    variables JSONB DEFAULT '{}', -- Dynamic template variables
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'complained'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    complained_at TIMESTAMP,
    error_message TEXT,
    error_code VARCHAR(50),
    message_id VARCHAR(255),
    provider_used VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    device_info JSONB,
    engagement_score DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'complained'))
);

-- Indexes
CREATE INDEX idx_email_recipients_campaign_id ON email_recipients(campaign_id);
CREATE INDEX idx_email_recipients_email ON email_recipients(email);
CREATE INDEX idx_email_recipients_status ON email_recipients(status);
CREATE INDEX idx_email_recipients_sent_at ON email_recipients(sent_at);
CREATE INDEX idx_email_recipients_opened_at ON email_recipients(opened_at);
CREATE INDEX idx_email_recipients_clicked_at ON email_recipients(clicked_at);
CREATE INDEX idx_email_recipients_message_id ON email_recipients(message_id);
CREATE INDEX idx_email_recipients_provider ON email_recipients(provider_used);
CREATE INDEX idx_email_recipients_engagement_score ON email_recipients(engagement_score);
```

### 6. Email Logs Model
```sql
CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE SET NULL,
    recipient_id INTEGER REFERENCES email_recipients(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    provider_used VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'complained'
    message_id VARCHAR(255),
    error_message TEXT,
    error_code VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    device_info JSONB,
    processing_time INTEGER, -- in milliseconds
    size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (status IN ('sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'complained'))
);

-- Indexes
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_campaign_id ON email_logs(campaign_id);
CREATE INDEX idx_email_logs_recipient_id ON email_logs(recipient_id);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_provider ON email_logs(provider_used);
CREATE INDEX idx_email_logs_message_id ON email_logs(message_id);
CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
```

### 7. API Usage Model
```sql
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    request_count INTEGER DEFAULT 0,
    email_count INTEGER DEFAULT 0,
    bulk_email_count INTEGER DEFAULT 0,
    template_count INTEGER DEFAULT 0,
    campaign_count INTEGER DEFAULT 0,
    ai_request_count INTEGER DEFAULT 0,
    total_bytes_sent BIGINT DEFAULT 0,
    total_bytes_received BIGINT DEFAULT 0,
    avg_response_time INTEGER DEFAULT 0, -- in milliseconds
    error_count INTEGER DEFAULT 0,
    rate_limit_hits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_date UNIQUE(user_id, date),
    CONSTRAINT valid_counts CHECK (request_count >= 0 AND email_count >= 0 AND bulk_email_count >= 0)
);

-- Indexes
CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, date);
CREATE INDEX idx_api_usage_date ON api_usage(date);
CREATE INDEX idx_api_usage_request_count ON api_usage(request_count);
```

### 8. Webhook Events Model
```sql
CREATE TABLE webhook_events (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    message_id VARCHAR(255),
    recipient_email VARCHAR(255),
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE SET NULL,
    recipient_id INTEGER REFERENCES email_recipients(id) ON DELETE SET NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    processing_attempts INTEGER DEFAULT 0,
    processing_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_processing_attempts CHECK (processing_attempts >= 0)
);

-- Indexes
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);
CREATE INDEX idx_webhook_events_message_id ON webhook_events(message_id);
CREATE INDEX idx_webhook_events_campaign_id ON webhook_events(campaign_id);
CREATE INDEX idx_webhook_events_recipient_id ON webhook_events(recipient_id);
```

### 9. User Settings Model
```sql
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferences JSONB DEFAULT '{}',
    notifications JSONB DEFAULT '{}',
    security_settings JSONB DEFAULT '{}',
    ui_settings JSONB DEFAULT '{}',
    email_settings JSONB DEFAULT '{}',
    analytics_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

### 10. System Logs Model
```sql
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL, -- 'debug', 'info', 'warn', 'error', 'fatal'
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INTEGER,
    response_time INTEGER, -- in milliseconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_level CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    CONSTRAINT valid_method CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
    CONSTRAINT valid_status_code CHECK (status_code >= 100 AND status_code <= 599)
);

-- Indexes
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_endpoint ON system_logs(endpoint);
CREATE INDEX idx_system_logs_status_code ON system_logs(status_code);
CREATE INDEX idx_system_logs_request_id ON system_logs(request_id);
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

-- Users -> Email Campaigns (1:many)
ALTER TABLE email_campaigns ADD CONSTRAINT fk_email_campaigns_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Email Templates -> Email Campaigns (1:many)
ALTER TABLE email_campaigns ADD CONSTRAINT fk_email_campaigns_template 
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

-- Email Campaigns -> Email Recipients (1:many)
ALTER TABLE email_recipients ADD CONSTRAINT fk_email_recipients_campaign 
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE;

-- Users -> Email Logs (1:many)
ALTER TABLE email_logs ADD CONSTRAINT fk_email_logs_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Email Campaigns -> Email Logs (1:many)
ALTER TABLE email_logs ADD CONSTRAINT fk_email_logs_campaign 
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE SET NULL;

-- Email Recipients -> Email Logs (1:many)
ALTER TABLE email_logs ADD CONSTRAINT fk_email_logs_recipient 
    FOREIGN KEY (recipient_id) REFERENCES email_recipients(id) ON DELETE SET NULL;

-- Users -> API Usage (1:many)
ALTER TABLE api_usage ADD CONSTRAINT fk_api_usage_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Users -> User Settings (1:1)
ALTER TABLE user_settings ADD CONSTRAINT fk_user_settings_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Email Templates -> Email Templates (self-reference for versions)
ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_parent 
    FOREIGN KEY (parent_template_id) REFERENCES email_templates(id) ON DELETE SET NULL;
```

### Check Constraints
```sql
-- Email validation
ALTER TABLE users ADD CONSTRAINT valid_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Phone validation
ALTER TABLE users ADD CONSTRAINT valid_phone_format 
    CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');

-- Role validation
ALTER TABLE users ADD CONSTRAINT valid_role 
    CHECK (role IN ('user', 'admin', 'enterprise', 'developer'));

-- Status validation
ALTER TABLE users ADD CONSTRAINT valid_user_status 
    CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));

-- Provider type validation
ALTER TABLE email_providers ADD CONSTRAINT valid_provider_type 
    CHECK (type IN ('sendgrid', 'mailgun', 'smtp', 'ses', 'postmark'));

-- Campaign status validation
ALTER TABLE email_campaigns ADD CONSTRAINT valid_campaign_status 
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed', 'cancelled'));

-- Campaign type validation
ALTER TABLE email_campaigns ADD CONSTRAINT valid_campaign_type 
    CHECK (type IN ('regular', 'automated', 'triggered', 'a_b_test'));

-- Recipient status validation
ALTER TABLE email_recipients ADD CONSTRAINT valid_recipient_status 
    CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'complained'));

-- Log status validation
ALTER TABLE email_logs ADD CONSTRAINT valid_log_status 
    CHECK (status IN ('sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'complained'));
```

## 📊 Advanced Indexes

### Composite Indexes
```sql
-- Email logs by user and date range
CREATE INDEX idx_email_logs_user_created_at ON email_logs(user_id, created_at);

-- Email logs by campaign and status
CREATE INDEX idx_email_logs_campaign_status ON email_logs(campaign_id, status);

-- Email recipients by campaign and status
CREATE INDEX idx_email_recipients_campaign_status ON email_recipients(campaign_id, status);

-- Email recipients by status and engagement
CREATE INDEX idx_email_recipients_status_engagement ON email_recipients(status, engagement_score);

-- API usage by user and date
CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, date);

-- Webhook events by provider and processed status
CREATE INDEX idx_webhook_events_provider_processed ON webhook_events(provider, processed);
```

### Partial Indexes
```sql
-- Active users only
CREATE INDEX idx_users_active ON users(id) WHERE status = 'active';

-- Active email providers only
CREATE INDEX idx_email_providers_active ON email_providers(id) WHERE is_active = true;

-- Failed emails only
CREATE INDEX idx_email_logs_failed ON email_logs(id) WHERE status = 'failed';

-- Unprocessed webhook events only
CREATE INDEX idx_webhook_events_unprocessed ON webhook_events(id) WHERE processed = false;

-- Recent system logs (last 30 days)
CREATE INDEX idx_system_logs_recent ON system_logs(id) WHERE created_at > CURRENT_DATE - INTERVAL '30 days';
```

### GIN Indexes for JSONB
```sql
-- Email provider config
CREATE INDEX idx_email_providers_config ON email_providers USING GIN(config);

-- Email template variables
CREATE INDEX idx_email_templates_variables ON email_templates USING GIN(variables);

-- Email template settings
CREATE INDEX idx_email_templates_settings ON email_templates USING GIN(settings);

-- Campaign settings
CREATE INDEX idx_email_campaigns_settings ON email_campaigns USING GIN(settings);

-- Email recipient variables
CREATE INDEX idx_email_recipients_variables ON email_recipients USING GIN(variables);

-- Email logs metadata
CREATE INDEX idx_email_logs_metadata ON email_logs USING GIN(metadata);

-- Webhook event data
CREATE INDEX idx_webhook_events_data ON webhook_events USING GIN(event_data);

-- User settings JSONB fields
CREATE INDEX idx_user_settings_preferences ON user_settings USING GIN(preferences);
CREATE INDEX idx_user_settings_notifications ON user_settings USING GIN(notifications);
CREATE INDEX idx_user_settings_security ON user_settings USING GIN(security_settings);

-- System logs context
CREATE INDEX idx_system_logs_context ON system_logs USING GIN(context);
```

## 🔄 Triggers & Functions

### Auto-update Timestamps
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_providers_updated_at BEFORE UPDATE ON email_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_usage_updated_at BEFORE UPDATE ON api_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Provider Usage Tracking
```sql
-- Function to track provider usage
CREATE OR REPLACE FUNCTION track_provider_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update provider usage counts
    UPDATE email_providers 
    SET 
        current_daily_count = current_daily_count + 1,
        current_monthly_count = current_monthly_count + 1,
        current_yearly_count = current_yearly_count + 1,
        last_used = CURRENT_TIMESTAMP
    WHERE id = NEW.provider_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for email logs
CREATE TRIGGER track_provider_usage_on_log
    AFTER INSERT ON email_logs
    FOR EACH ROW EXECUTE FUNCTION track_provider_usage();
```

### Daily Reset Function
```sql
-- Function to reset daily counters
CREATE OR REPLACE FUNCTION reset_daily_counters()
RETURNS void AS $$
BEGIN
    UPDATE email_providers 
    SET 
        current_daily_count = 0,
        last_reset_date = CURRENT_DATE
    WHERE last_reset_date < CURRENT_DATE;
    
    -- Log the reset
    INSERT INTO system_logs (level, message, context)
    VALUES ('info', 'Daily counters reset', jsonb_build_object('reset_date', CURRENT_DATE));
END;
$$ language 'plpgsql';

-- Schedule daily reset (using pg_cron if available)
-- SELECT cron.schedule('reset-daily-counters', '0 0 * * *', 'SELECT reset_daily_counters();');
```

## 📈 Performance Optimization

### Materialized Views
```sql
-- User email statistics
CREATE MATERIALIZED VIEW user_email_stats AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(el.id) as total_emails,
    COUNT(CASE WHEN el.status = 'sent' THEN 1 END) as sent_emails,
    COUNT(CASE WHEN el.status = 'failed' THEN 1 END) as failed_emails,
    ROUND(AVG(CASE WHEN el.status = 'sent' THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate,
    MAX(el.created_at) as last_email_sent
FROM users u
LEFT JOIN email_logs el ON u.id = el.user_id
GROUP BY u.id, u.email;

CREATE INDEX idx_user_email_stats_user_id ON user_email_stats(user_id);

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_user_email_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_email_stats;
END;
$$ language 'plpgsql';
```

### Query Optimization Examples
```sql
-- Optimized query for user dashboard
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(el.id) as total_emails,
    COUNT(CASE WHEN el.status = 'sent' THEN 1 END) as sent_emails,
    COUNT(CASE WHEN el.status = 'failed' THEN 1 END) as failed_emails
FROM users u
LEFT JOIN email_logs el ON u.id = el.user_id 
    AND el.created_at >= CURRENT_DATE - INTERVAL '30 days'
WHERE u.id = $1
GROUP BY u.id, u.email, u.first_name, u.last_name;

-- Optimized query for campaign analytics
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    ec.id,
    ec.name,
    ec.recipient_count,
    ec.success_count,
    ec.failure_count,
    ec.open_count,
    ec.click_count,
    ROUND((ec.success_count::float / NULLIF(ec.recipient_count, 0) * 100), 2) as delivery_rate,
    ROUND((ec.open_count::float / NULLIF(ec.success_count, 0) * 100), 2) as open_rate,
    ROUND((ec.click_count::float / NULLIF(ec.open_count, 0) * 100), 2) as click_rate
FROM email_campaigns ec
WHERE ec.user_id = $1
    AND ec.created_at >= $2
    AND ec.created_at <= $3
ORDER BY ec.created_at DESC;
```
