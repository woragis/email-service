pub mod traits;
pub mod smtp;
pub mod mock;

use std::sync::Arc;

pub use traits::{EmailProvider, EmailAddress, MailError};
pub use smtp::{SmtpEmailProvider, SmtpConfig};
pub use mock::MockEmailProvider;

/// Create an email provider based on configuration
pub fn create_email_provider(
    provider_type: &str,
    config: Option<SmtpConfig>,
) -> Result<Arc<dyn EmailProvider>, MailError> {
    match provider_type {
        "smtp" => {
            let smtp_config = config.ok_or_else(|| {
                MailError::Configuration("SMTP configuration is required for SMTP provider".to_string())
            })?;
            Ok(Arc::new(SmtpEmailProvider::new(smtp_config)))
        }
        "mock" | "development" => {
            Ok(Arc::new(MockEmailProvider::new()))
        }
        _ => Err(MailError::Configuration(format!(
            "Unknown email provider type: {}. Supported types: smtp, mock, development",
            provider_type
        ))),
    }
}
