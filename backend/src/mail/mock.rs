use super::traits::{EmailProvider, EmailMessage, EmailAddress, EmailTemplate, MailResult};
use async_trait::async_trait;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Clone)]
pub struct MockEmailProvider {
    sent_emails: Arc<Mutex<Vec<EmailMessage>>>,
}

impl MockEmailProvider {
    pub fn new() -> Self {
        Self {
            sent_emails: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub async fn get_sent_emails(&self) -> Vec<EmailMessage> {
        self.sent_emails.lock().await.clone()
    }

    pub async fn clear_sent_emails(&self) {
        self.sent_emails.lock().await.clear();
    }

    pub async fn get_last_email(&self) -> Option<EmailMessage> {
        self.sent_emails.lock().await.last().cloned()
    }

    fn log_email(&self, message: &EmailMessage) {
        println!("📧 Mock Email Sent:");
        println!("  To: {:?}", message.to);
        println!("  From: {:?}", message.from);
        println!("  Subject: {}", message.subject);
        if let Some(html) = &message.html_body {
            println!("  HTML Body: {} characters", html.len());
        }
        if let Some(text) = &message.text_body {
            println!("  Text Body: {} characters", text.len());
        }
        println!("---");
    }
}

#[async_trait]
impl EmailProvider for MockEmailProvider {
    async fn send_email(&self, message: EmailMessage) -> MailResult<()> {
        self.log_email(&message);
        self.sent_emails.lock().await.push(message);
        Ok(())
    }

    async fn send_template_email(
        &self,
        template: EmailTemplate,
        to: Vec<EmailAddress>,
        from: EmailAddress,
        variables: serde_json::Value,
    ) -> MailResult<()> {
        // Simple template rendering (for mock purposes)
        let subject = template.subject.replace("{{user_name}}", 
            variables.get("user_name").and_then(|v| v.as_str()).unwrap_or("there"));
        
        let html_body = template.html_template.replace("{{user_name}}", 
            variables.get("user_name").and_then(|v| v.as_str()).unwrap_or("there"));
        
        let text_body = template.text_template.replace("{{user_name}}", 
            variables.get("user_name").and_then(|v| v.as_str()).unwrap_or("there"));

        let message = EmailMessage::new(to, from, subject)
            .with_html_body(html_body)
            .with_text_body(text_body);

        self.send_email(message).await
    }

    async fn send_password_reset_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        reset_token: &str,
        user_name: Option<&str>,
    ) -> MailResult<()> {
        println!("🔐 Password Reset Email:");
        println!("  To: {} ({})", to.email, user_name.unwrap_or("Unknown"));
        println!("  Token: {}", reset_token);
        println!("  Reset URL: http://localhost:3000/reset-password?token={}", reset_token);
        println!("---");
        
        // Create a simple message for the mock
        let message = EmailMessage::new(
            vec![to],
            from,
            "Reset Your Password - Jazz Melodic".to_string(),
        )
        .with_text_body(format!(
            "Hello {},\n\nTo reset your password, please click the following link:\nhttp://localhost:3000/reset-password?token={}\n\nThis link will expire in 1 hour.\n\nBest regards,\nThe Jazz Melodic Team",
            user_name.unwrap_or("there"),
            reset_token
        ));

        self.send_email(message).await
    }

    async fn send_welcome_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        user_name: &str,
    ) -> MailResult<()> {
        println!("🎉 Welcome Email:");
        println!("  To: {} ({})", to.email, user_name);
        println!("  Login URL: http://localhost:3000/login");
        println!("---");

        let message = EmailMessage::new(
            vec![to],
            from,
            "Welcome to Jazz Melodic! 🎵".to_string(),
        )
        .with_text_body(format!(
            "Hello {},\n\nWelcome to Jazz Melodic! We're excited to have you join our community.\n\nGet started by visiting: http://localhost:3000/login\n\nBest regards,\nThe Jazz Melodic Team",
            user_name
        ));

        self.send_email(message).await
    }

    async fn send_verification_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        verification_token: &str,
        user_name: Option<&str>,
    ) -> MailResult<()> {
        println!("✅ Email Verification:");
        println!("  To: {} ({})", to.email, user_name.unwrap_or("Unknown"));
        println!("  Token: {}", verification_token);
        println!("  Verification URL: http://localhost:3000/verify-email?token={}", verification_token);
        println!("---");

        let message = EmailMessage::new(
            vec![to],
            from,
            "Verify Your Email - Jazz Melodic".to_string(),
        )
        .with_text_body(format!(
            "Hello {},\n\nPlease verify your email address by clicking the following link:\nhttp://localhost:3000/verify-email?token={}\n\nBest regards,\nThe Jazz Melodic Team",
            user_name.unwrap_or("there"),
            verification_token
        ));

        self.send_email(message).await
    }
}

impl Default for MockEmailProvider {
    fn default() -> Self {
        Self::new()
    }
}
