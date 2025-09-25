use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailRecord {
    pub id: uuid::Uuid,
    pub to_email: String,
    pub from_email: String,
    pub subject: String,
    pub html_body: Option<String>,
    pub text_body: Option<String>,
    pub template_used: Option<String>,
    pub status: EmailStatus,
    pub sent_at: DateTime<Utc>,
    pub delivered_at: Option<DateTime<Utc>>,
    pub opened_at: Option<DateTime<Utc>>,
    pub clicked_at: Option<DateTime<Utc>>,
    pub bounced_at: Option<DateTime<Utc>>,
    pub complained_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EmailStatus {
    Pending,
    Sent,
    Delivered,
    Opened,
    Clicked,
    Bounced,
    Complained,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IncomingEmail {
    pub id: uuid::Uuid,
    pub from_email: String,
    pub to_email: String,
    pub subject: String,
    pub html_body: Option<String>,
    pub text_body: Option<String>,
    pub headers: serde_json::Value,
    pub attachments: Vec<EmailAttachment>,
    pub received_at: DateTime<Utc>,
    pub processed_at: Option<DateTime<Utc>>,
    pub status: IncomingEmailStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailAttachment {
    pub id: uuid::Uuid,
    pub filename: String,
    pub content_type: String,
    pub size: u64,
    pub data: Vec<u8>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum IncomingEmailStatus {
    Received,
    Processing,
    Processed,
    Failed,
    Ignored,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailTemplate {
    pub id: uuid::Uuid,
    pub name: String,
    pub subject: String,
    pub html_template: String,
    pub text_template: String,
    pub variables: serde_json::Value,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailWebhook {
    pub id: uuid::Uuid,
    pub event_type: String,
    pub recipient: String,
    pub domain: String,
    pub message_id: Option<String>,
    pub timestamp: DateTime<Utc>,
    pub payload: serde_json::Value,
    pub processed: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
