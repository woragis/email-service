use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum MailError {
    #[error("SMTP error: {0}")]
    Smtp(String),
    #[error("Template error: {0}")]
    Template(String),
    #[error("Configuration error: {0}")]
    Configuration(String),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    #[error("Lettre error: {0}")]
    Lettre(#[from] lettre::error::Error),
}

pub type MailResult<T> = Result<T, MailError>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailAddress {
    pub email: String,
    pub name: Option<String>,
}

impl EmailAddress {
    pub fn new(email: String) -> Self {
        Self { email, name: None }
    }

    pub fn with_name(email: String, name: String) -> Self {
        Self {
            email,
            name: Some(name),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailMessage {
    pub to: Vec<EmailAddress>,
    pub from: EmailAddress,
    pub subject: String,
    pub html_body: Option<String>,
    pub text_body: Option<String>,
    pub reply_to: Option<EmailAddress>,
}

impl EmailMessage {
    pub fn new(
        to: Vec<EmailAddress>,
        from: EmailAddress,
        subject: String,
    ) -> Self {
        Self {
            to,
            from,
            subject,
            html_body: None,
            text_body: None,
            reply_to: None,
        }
    }

    pub fn with_html_body(mut self, html_body: String) -> Self {
        self.html_body = Some(html_body);
        self
    }

    pub fn with_text_body(mut self, text_body: String) -> Self {
        self.text_body = Some(text_body);
        self
    }

    pub fn with_reply_to(mut self, reply_to: EmailAddress) -> Self {
        self.reply_to = Some(reply_to);
        self
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailTemplate {
    pub subject: String,
    pub html_template: String,
    pub text_template: String,
}

#[async_trait]
pub trait EmailProvider: Send + Sync {
    /// Send an email message
    async fn send_email(&self, message: EmailMessage) -> MailResult<()>;

    /// Send an email using a template with variables
    async fn send_template_email(
        &self,
        template: EmailTemplate,
        to: Vec<EmailAddress>,
        from: EmailAddress,
        variables: serde_json::Value,
    ) -> MailResult<()>;

    /// Send a password reset email
    async fn send_password_reset_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        reset_token: &str,
        user_name: Option<&str>,
    ) -> MailResult<()>;

    /// Send a welcome email
    async fn send_welcome_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        user_name: &str,
    ) -> MailResult<()>;

    /// Send an email verification email
    async fn send_verification_email(
        &self,
        to: EmailAddress,
        from: EmailAddress,
        verification_token: &str,
        user_name: Option<&str>,
    ) -> MailResult<()>;
}
