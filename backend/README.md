# 📧 Email Backend Service

A standalone email service for Jazz Melodic that handles both sending and receiving emails.

## 🚀 Features

### 📤 Email Sending
- **SMTP Support** - Send emails via SMTP (Mailgun, SendGrid, etc.)
- **Mock Mode** - Development mode with console logging
- **Template System** - Pre-built email templates (welcome, password reset, verification)
- **Custom Emails** - Send custom HTML/text emails
- **Multiple Recipients** - Send to multiple recipients at once

### 📥 Email Receiving
- **Multipart Form Support** - Receive emails via HTTP POST
- **Email Parsing** - Parse incoming email content and headers
- **Attachment Handling** - Process email attachments
- **Auto-reply** - Send automatic responses

### 🔗 Webhook Support
- **Event Tracking** - Track email delivery, opens, clicks, bounces
- **Real-time Updates** - Receive webhook notifications from email providers
- **Status Updates** - Update email status in real-time

## 🛠️ Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp env.example .env
```

Update the `.env` file with your email provider settings:

```bash
# For Mailgun SMTP
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=postmaster@your-domain.com
SMTP_PASSWORD=your-smtp-password
SMTP_USE_STARTTLS=true

# For development/testing
EMAIL_PROVIDER=mock
```

### 2. Build and Run

```bash
# Build the project
cargo build

# Run the email service
cargo run
```

The service will start on `http://localhost:8080`

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Send Email
```bash
POST /send
Content-Type: application/json

{
  "to": ["user@example.com"],
  "subject": "Hello World",
  "html_body": "<h1>Hello!</h1>",
  "text_body": "Hello!"
}
```

### Send Template Email
```bash
POST /send
Content-Type: application/json

{
  "to": ["user@example.com"],
  "template": "welcome",
  "variables": {
    "user_name": "John Doe"
  }
}
```

### Receive Email
```bash
POST /receive
Content-Type: multipart/form-data

# Email content as multipart form data
```

### Webhook Handler
```bash
POST /webhook
Content-Type: application/json

{
  "event": "delivered",
  "recipient": "user@example.com",
  "timestamp": 1234567890
}
```

### Test Email
```bash
GET /test
```

## 📧 Email Templates

### Available Templates

1. **welcome** - Welcome new users
2. **password_reset** - Password reset emails
3. **verification** - Email verification

### Template Variables

- `user_name` - User's name
- `reset_url` - Password reset URL (for password_reset template)
- `verification_url` - Email verification URL (for verification template)
- `login_url` - Login page URL (for welcome template)

## 🔧 Integration

### With Jazz Melodic Backend

Update your main backend to use the email service:

```rust
// In your main backend
let email_service_url = "http://localhost:8080";

// Send welcome email
let response = reqwest::Client::new()
    .post(&format!("{}/send", email_service_url))
    .json(&serde_json::json!({
        "to": ["user@example.com"],
        "template": "welcome",
        "variables": {
            "user_name": "John Doe"
        }
    }))
    .send()
    .await?;
```

### With Mailgun Webhooks

Configure Mailgun webhooks to point to your email service:

```
Webhook URL: https://your-domain.com/webhook
Events: delivered, bounced, complained, opened, clicked
```

## 🏗️ Architecture

```
@email/
├── src/
│   ├── main.rs          # Main application entry point
│   ├── config.rs        # Configuration management
│   ├── handlers.rs      # HTTP request handlers
│   ├── models.rs        # Data models
│   └── mail/
│       ├── mod.rs       # Email module exports
│       ├── traits.rs    # Email provider traits
│       ├── smtp.rs      # SMTP email provider
│       └── mock.rs      # Mock email provider
├── Cargo.toml           # Dependencies
├── env.example          # Environment configuration example
└── README.md            # This file
```

## 🚀 Deployment

### Docker (Coming Soon)
```bash
docker build -t email-backend .
docker run -p 8080:8080 --env-file .env email-backend
```

### Systemd Service (Coming Soon)
```bash
sudo systemctl enable email-backend
sudo systemctl start email-backend
```

## 🔍 Monitoring

The service provides structured logging for:
- Email sending attempts
- Webhook events
- Error conditions
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is part of the Jazz Melodic application suite.
