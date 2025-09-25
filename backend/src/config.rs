use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailConfig {
    pub provider: EmailProvider,
    pub from_email: String,
    pub from_name: Option<String>,
    pub frontend_url: String,
    pub smtp: Option<SmtpConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EmailProvider {
    Smtp,
    Mock,
}

impl std::str::FromStr for EmailProvider {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "smtp" => Ok(EmailProvider::Smtp),
            "mock" => Ok(EmailProvider::Mock),
            _ => Err(format!("Invalid email provider: {}. Supported: smtp, mock", s)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SmtpConfig {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub use_tls: bool,
    pub use_starttls: bool,
}

impl EmailConfig {
    pub fn from_env() -> Result<Self, anyhow::Error> {
        let provider_str = env::var("EMAIL_PROVIDER").unwrap_or_else(|_| "mock".to_string());
        let provider = provider_str.parse().map_err(|e| anyhow::anyhow!("Error parsing EMAIL_PROVIDER: {}", e))?;

        let from_email = env::var("EMAIL_FROM").unwrap_or_else(|_| "noreply@example.com".to_string());
        let from_name = env::var("EMAIL_FROM_NAME").ok();
        let frontend_url = env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:3000".to_string());

        let smtp = if matches!(provider, EmailProvider::Smtp) {
            Some(SmtpConfig::from_env()?)
        } else {
            None
        };

        Ok(EmailConfig {
            provider,
            from_email,
            from_name,
            frontend_url,
            smtp,
        })
    }
}

impl SmtpConfig {
    pub fn from_env() -> Result<Self, anyhow::Error> {
        let host = env::var("SMTP_HOST")
            .map_err(|_| anyhow::anyhow!("SMTP_HOST environment variable is required"))?;

        let port_str = env::var("SMTP_PORT")
            .map_err(|_| anyhow::anyhow!("SMTP_PORT environment variable is required"))?;
        let port = port_str.parse::<u16>()
            .map_err(|e| anyhow::anyhow!("Invalid SMTP_PORT: {}", e))?;

        let username = env::var("SMTP_USERNAME")
            .map_err(|_| anyhow::anyhow!("SMTP_USERNAME environment variable is required"))?;

        let password = env::var("SMTP_PASSWORD")
            .map_err(|_| anyhow::anyhow!("SMTP_PASSWORD environment variable is required"))?;

        let use_tls_str = env::var("SMTP_USE_TLS").unwrap_or_else(|_| "false".to_string());
        let use_tls = use_tls_str.parse::<bool>()
            .map_err(|e| anyhow::anyhow!("Invalid SMTP_USE_TLS: {}", e))?;

        let use_starttls_str = env::var("SMTP_USE_STARTTLS").unwrap_or_else(|_| "true".to_string());
        let use_starttls = use_starttls_str.parse::<bool>()
            .map_err(|e| anyhow::anyhow!("Invalid SMTP_USE_STARTTLS: {}", e))?;

        Ok(SmtpConfig {
            host,
            port,
            username,
            password,
            use_tls,
            use_starttls,
        })
    }
}
