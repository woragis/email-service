use crate::{AppState, mail::{EmailAddress, traits::EmailMessage}};
use axum::{
    extract::{Multipart, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
pub struct SendEmailRequest {
    pub to: Vec<String>,
    pub subject: String,
    pub html_body: Option<String>,
    pub text_body: Option<String>,
    pub template: Option<String>,
    pub variables: Option<HashMap<String, Value>>,
}

#[derive(Debug, Serialize)]
pub struct SendEmailResponse {
    pub success: bool,
    pub message: String,
    pub message_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct WebhookRequest {
    pub event: String,
    pub timestamp: Option<i64>,
    pub message: Option<Value>,
    pub recipient: Option<String>,
    pub domain: Option<String>,
}

pub async fn send_email_handler(
    State(state): State<AppState>,
    Json(payload): Json<SendEmailRequest>,
) -> Result<Json<SendEmailResponse>, StatusCode> {
    tracing::info!("📤 Received send email request: {:?}", payload);

    // Convert string emails to EmailAddress
    let to_addresses: Vec<EmailAddress> = payload
        .to
        .into_iter()
        .map(|email| EmailAddress::new(email))
        .collect();

    let from_address = EmailAddress::with_name(
        state.config.from_email.clone(),
        state.config.from_name.unwrap_or_else(|| "Email Backend".to_string())
    );

    let result = if let Some(template) = payload.template {
        // Send template email
        let variables = payload.variables.unwrap_or_default();
        let template_obj = match template.as_str() {
            "welcome" => {
                let user_name = variables.get("user_name")
                    .and_then(|v| v.as_str())
                    .unwrap_or("User");
                state.email_provider.send_welcome_email(
                    to_addresses[0].clone(),
                    from_address,
                    user_name
                ).await
            }
            "password_reset" => {
                let reset_token = variables.get("reset_token")
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let user_name = variables.get("user_name")
                    .and_then(|v| v.as_str());
                state.email_provider.send_password_reset_email(
                    to_addresses[0].clone(),
                    from_address,
                    reset_token,
                    user_name
                ).await
            }
            "verification" => {
                let verification_token = variables.get("verification_token")
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                let user_name = variables.get("user_name")
                    .and_then(|v| v.as_str());
                state.email_provider.send_verification_email(
                    to_addresses[0].clone(),
                    from_address,
                    verification_token,
                    user_name
                ).await
            }
            _ => {
                tracing::error!("Unknown template: {}", template);
                return Err(StatusCode::BAD_REQUEST);
            }
        };
        template_obj
    } else {
        // Send custom email
        let message = EmailMessage::new(to_addresses, from_address, payload.subject)
            .with_html_body(payload.html_body.unwrap_or_default())
            .with_text_body(payload.text_body.unwrap_or_default());

        state.email_provider.send_email(message).await
    };

    match result {
        Ok(_) => {
            tracing::info!("✅ Email sent successfully");
            Ok(Json(SendEmailResponse {
                success: true,
                message: "Email sent successfully".to_string(),
                message_id: Some(uuid::Uuid::new_v4().to_string()),
            }))
        }
        Err(e) => {
            tracing::error!("❌ Failed to send email: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn receive_email_handler(
    State(_state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<Value>, StatusCode> {
    tracing::info!("📥 Received email via multipart form");

    let mut email_data = HashMap::new();

    while let Some(field) = multipart.next_field().await.map_err(|_| StatusCode::BAD_REQUEST)? {
        let name = field.name().unwrap_or("unknown").to_string();
        let data = field.bytes().await.map_err(|_| StatusCode::BAD_REQUEST)?;
        
        email_data.insert(name, String::from_utf8_lossy(&data).to_string());
    }

    tracing::info!("📧 Received email data: {:?}", email_data);

    // Here you would typically:
    // 1. Parse the email content
    // 2. Extract sender, subject, body
    // 3. Process the email (save to database, forward, etc.)
    // 4. Send auto-reply if needed

    Ok(Json(json!({
        "status": "received",
        "message": "Email received and processed",
        "data": email_data
    })))
}

pub async fn webhook_handler(
    State(_state): State<AppState>,
    Json(payload): Json<WebhookRequest>,
) -> Result<Json<Value>, StatusCode> {
    tracing::info!("🔗 Received webhook: {:?}", payload);

    match payload.event.as_str() {
        "delivered" => {
            tracing::info!("✅ Email delivered to: {:?}", payload.recipient);
        }
        "bounced" => {
            tracing::warn!("❌ Email bounced for: {:?}", payload.recipient);
        }
        "complained" => {
            tracing::warn!("⚠️ Email complaint from: {:?}", payload.recipient);
        }
        "opened" => {
            tracing::info!("👀 Email opened by: {:?}", payload.recipient);
        }
        "clicked" => {
            tracing::info!("🖱️ Email link clicked by: {:?}", payload.recipient);
        }
        _ => {
            tracing::info!("📬 Other email event: {}", payload.event);
        }
    }

    // Here you would typically:
    // 1. Update email status in database
    // 2. Track engagement metrics
    // 3. Handle bounces/complaints
    // 4. Update user preferences

    Ok(Json(json!({
        "status": "processed",
        "event": payload.event,
        "timestamp": chrono::Utc::now().to_rfc3339()
    })))
}
