use super::traits::{EmailProvider, EmailMessage, EmailAddress, EmailTemplate, MailResult, MailError};
use async_trait::async_trait;
use lettre::{
    message::{header::ContentType, Mailbox, MultiPart, SinglePart},
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};

#[derive(Debug, Clone)]
pub struct SmtpConfig {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub use_tls: bool,
    pub use_starttls: bool,
    pub from_email: String,
    pub from_name: Option<String>,
    pub frontend_url: String,
}

#[derive(Debug, Clone)]
pub struct SmtpEmailProvider {
    transport: AsyncSmtpTransport<Tokio1Executor>,
    config: SmtpConfig,
}

impl SmtpEmailProvider {
    pub fn new(config: SmtpConfig) -> Self {
        let mut transport_builder = AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous(&config.host)
            .port(config.port);

        if config.use_tls {
            transport_builder = transport_builder.tls(lettre::transport::smtp::client::Tls::Required(
                lettre::transport::smtp::client::TlsParameters::new_native(config.host.clone()).unwrap()
            ));
        } else if config.use_starttls {
            transport_builder = transport_builder.tls(lettre::transport::smtp::client::Tls::Opportunistic(
                lettre::transport::smtp::client::TlsParameters::new_native(config.host.clone()).unwrap()
            ));
        }

        if !config.username.is_empty() {
            let credentials = Credentials::new(config.username.clone(), config.password.clone());
            transport_builder = transport_builder.credentials(credentials);
        }

        let transport = transport_builder.build();

        Self { transport, config }
    }

    fn create_mailbox(email: EmailAddress) -> Result<Mailbox, MailError> {
        let email_str = if let Some(name) = email.name {
            format!("{} <{}>", name, email.email)
        } else {
            email.email
        };
        
        email_str.parse()
            .map_err(|e| MailError::Smtp(format!("Invalid email address: {}", e)))
    }

    fn render_template(template: &str, variables: &serde_json::Value) -> MailResult<String> {
        let mut rendered = template.to_string();
        
        if let Some(obj) = variables.as_object() {
            for (key, value) in obj {
                let placeholder = format!("{{{{{}}}}}", key);
                let replacement = match value {
                    serde_json::Value::String(s) => s.clone(),
                    serde_json::Value::Number(n) => n.to_string(),
                    serde_json::Value::Bool(b) => b.to_string(),
                    _ => value.to_string(),
                };
                rendered = rendered.replace(&placeholder, &replacement);
            }
        }
        
        Ok(rendered)
    }

    fn get_password_reset_template() -> EmailTemplate {
        EmailTemplate {
            subject: "Reset Your Password - Jazz Melodic".to_string(),
            html_template: r#"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎵 Jazz Melodic</h1>
        <h2>Password Reset Request</h2>
    </div>
    <div class="content">
        <p>Hello {{user_name}},</p>
        <p>We received a request to reset your password for your Jazz Melodic account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="{{reset_url}}" class="button">Reset My Password</a>
        <div class="warning">
            <strong>Important:</strong> This link will expire in 1 hour for security reasons.
        </div>
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>For security reasons, please do not share this link with anyone.</p>
    </div>
    <div class="footer">
        <p>Best regards,<br>The Jazz Melodic Team</p>
        <p><small>This is an automated message. Please do not reply to this email.</small></p>
    </div>
</body>
</html>
            "#.trim().to_string(),
            text_template: r#"
Reset Your Password - Jazz Melodic

Hello {{user_name}},

We received a request to reset your password for your Jazz Melodic account.

To reset your password, please click the following link:
{{reset_url}}

IMPORTANT: This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

For security reasons, please do not share this link with anyone.

Best regards,
The Jazz Melodic Team

---
This is an automated message. Please do not reply to this email.
            "#.trim().to_string(),
        }
    }

    fn get_welcome_template() -> EmailTemplate {
        EmailTemplate {
            subject: "Welcome to Jazz Melodic! 🎵".to_string(),
            html_template: r#"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Jazz Melodic</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎵 Jazz Melodic</h1>
        <h2>Welcome to the Community!</h2>
    </div>
    <div class="content">
        <p>Hello {{user_name}},</p>
        <p>Welcome to Jazz Melodic! We're excited to have you join our community of music lovers and jazz enthusiasts.</p>
        <p>Your account has been successfully created. You can now:</p>
        <ul>
            <li>Explore our collection of jazz videos and courses</li>
            <li>Connect with other music lovers</li>
            <li>Track your learning progress</li>
            <li>Discover new artists and techniques</li>
        </ul>
        <a href="{{login_url}}" class="button">Get Started</a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
    <div class="footer">
        <p>Best regards,<br>The Jazz Melodic Team</p>
        <p><small>This is an automated message. Please do not reply to this email.</small></p>
    </div>
</body>
</html>
            "#.trim().to_string(),
            text_template: r#"
Welcome to Jazz Melodic!

Hello {{user_name}},

Welcome to Jazz Melodic! We're excited to have you join our community of music lovers and jazz enthusiasts.

Your account has been successfully created. You can now:
- Explore our collection of jazz videos and courses
- Connect with other music lovers
- Track your learning progress
- Discover new artists and techniques

Get started by visiting: {{login_url}}

If you have any questions, feel free to reach out to our support team.

Best regards,
The Jazz Melodic Team

---
This is an automated message. Please do not reply to this email.
            "#.trim().to_string(),
        }
    }

    fn get_verification_template() -> EmailTemplate {
        EmailTemplate {
            subject: "Verify Your Email - Jazz Melodic".to_string(),
            html_template: r#"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎵 Jazz Melodic</h1>
        <h2>Verify Your Email Address</h2>
    </div>
    <div class="content">
        <p>Hello {{user_name}},</p>
        <p>Please verify your email address to complete your account setup.</p>
        <p>Click the button below to verify your email:</p>
        <a href="{{verification_url}}" class="button">Verify Email Address</a>
        <p>If you didn't create an account with us, please ignore this email.</p>
    </div>
    <div class="footer">
        <p>Best regards,<br>The Jazz Melodic Team</p>
        <p><small>This is an automated message. Please do not reply to this email.</small></p>
    </div>
</body>
</html>
            "#.trim().to_string(),
            text_template: r#"
Verify Your Email - Jazz Melodic

Hello {{user_name}},

Please verify your email address to complete your account setup.

To verify your email, please click the following link:
{{verification_url}}

If you didn't create an account with us, please ignore this email.

Best regards,
The Jazz Melodic Team

---
This is an automated message. Please do not reply to this email.
            "#.trim().to_string(),
        }
    }
}

#[async_trait]
impl EmailProvider for SmtpEmailProvider {
    async fn send_email(&self, message: EmailMessage) -> MailResult<()> {
        let from = Self::create_mailbox(message.from)?;
        let to: Result<Vec<Mailbox>, MailError> = message.to
            .into_iter()
            .map(Self::create_mailbox)
            .collect();
        let to = to?;

        let mut email_builder = Message::builder()
            .from(from)
            .subject(&message.subject);

        for recipient in to {
            email_builder = email_builder.to(recipient);
        }

        if let Some(reply_to) = message.reply_to {
            let reply_to_mailbox = Self::create_mailbox(reply_to)?;
            email_builder = email_builder.reply_to(reply_to_mailbox);
        }

        let email = if let Some(html_body) = message.html_body {
            if let Some(text_body) = message.text_body {
                // Both HTML and text
                email_builder.multipart(
                    MultiPart::alternative()
                        .singlepart(SinglePart::builder()
                            .header(ContentType::TEXT_PLAIN)
                            .body(text_body))
                        .singlepart(SinglePart::builder()
                            .header(ContentType::TEXT_HTML)
                            .body(html_body))
                )?
            } else {
                // Only HTML
                email_builder.body(html_body)?
            }
        } else if let Some(text_body) = message.text_body {
            // Only text
            email_builder.body(text_body)?
        } else {
            return Err(MailError::Configuration("Email must have either HTML or text body".to_string()));
        };

        self.transport.send(email).await
            .map_err(|e| MailError::Smtp(format!("Failed to send email: {}", e)))?;

        Ok(())
    }

    async fn send_template_email(
        &self,
        template: EmailTemplate,
        to: Vec<EmailAddress>,
        from: EmailAddress,
        variables: serde_json::Value,
    ) -> MailResult<()> {
        let subject = Self::render_template(&template.subject, &variables)?;
        let html_body = Some(Self::render_template(&template.html_template, &variables)?);
        let text_body = Some(Self::render_template(&template.text_template, &variables)?);

        let message = EmailMessage::new(to, from, subject)
            .with_html_body(html_body.unwrap())
            .with_text_body(text_body.unwrap());

        self.send_email(message).await
    }

    async fn send_password_reset_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        reset_token: &str,
        user_name: Option<&str>,
    ) -> MailResult<()> {
        let template = Self::get_password_reset_template();
        let reset_url = format!("{}/reset-password?token={}", self.config.frontend_url.clone(), reset_token);
        
        let variables = serde_json::json!({
            "reset_url": reset_url,
            "user_name": user_name.unwrap_or("there")
        });

        self.send_template_email(template, vec![to], from, variables).await
    }

    async fn send_welcome_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        user_name: &str,
    ) -> MailResult<()> {
        let template = Self::get_welcome_template();
        let login_url = format!("{}/login", self.config.frontend_url.clone());
        
        let variables = serde_json::json!({
            "user_name": user_name,
            "login_url": login_url
        });

        self.send_template_email(template, vec![to], from, variables).await
    }

    async fn send_verification_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        verification_token: &str,
        user_name: Option<&str>,
    ) -> MailResult<()> {
        let template = Self::get_verification_template();
        let verification_url = format!("{}/verify-email?token={}", self.config.frontend_url.clone(), verification_token);
        
        let variables = serde_json::json!({
            "verification_url": verification_url,
            "user_name": user_name.unwrap_or("there")
        });

        self.send_template_email(template, vec![to], from, variables).await
    }
}
