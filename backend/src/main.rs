mod mail;
mod config;
mod handlers;
mod models;

use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use config::EmailConfig;
use handlers::{send_email_handler, receive_email_handler, webhook_handler};
use mail::{create_email_provider, EmailAddress};
use serde_json::{json, Value};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing::{info, Level};
use tracing_subscriber;

#[derive(Clone)]
pub struct AppState {
    pub email_provider: std::sync::Arc<dyn mail::EmailProvider>,
    pub config: EmailConfig,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .with_target(false)
        .with_thread_ids(true)
        .with_thread_names(true)
        .init();

    info!("🚀 Starting Email Backend Service...");

    // Load configuration
    let config = EmailConfig::from_env()?;
    info!("📧 Email Provider: {:?}", config.provider);

    // Create email provider
    let email_provider = create_email_provider(
        match config.provider {
            config::EmailProvider::Smtp => "smtp",
            config::EmailProvider::Mock => "mock",
        },
        config.smtp.clone().map(|smtp_config| mail::SmtpConfig {
            host: smtp_config.host,
            port: smtp_config.port,
            username: smtp_config.username,
            password: smtp_config.password,
            use_tls: smtp_config.use_tls,
            use_starttls: smtp_config.use_starttls,
            from_email: config.from_email.clone(),
            from_name: config.from_name.clone(),
            frontend_url: config.frontend_url.clone(),
        }),
    )?;

    let app_state = AppState {
        email_provider,
        config,
    };

    // Build the application
    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/send", post(send_email_handler))
        .route("/receive", post(receive_email_handler))
        .route("/webhook", post(webhook_handler))
        .route("/test", get(test_email_handler))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    // Start the server
    let port = std::env::var("PORT").unwrap_or_else(|_| "8081".to_string()).parse::<u16>().unwrap_or(8081);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await?;
    
    info!("📬 Email Backend listening on http://{}", addr);
    info!("📧 Health check: http://{}/health", addr);
    info!("📤 Send emails: POST http://{}/send", addr);
    info!("📥 Receive emails: POST http://{}/receive", addr);
    info!("🔗 Webhooks: POST http://{}/webhook", addr);

    axum::serve(listener, app).await?;

    Ok(())
}

async fn health_handler() -> Json<Value> {
    Json(json!({
        "status": "healthy",
        "service": "email-backend",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

async fn test_email_handler(State(state): State<AppState>) -> Result<Json<Value>, StatusCode> {
    let test_email = EmailAddress::new("test@example.com".to_string());
    let from_email = EmailAddress::with_name(
        state.config.from_email.clone(),
        state.config.from_name.unwrap_or_else(|| "Email Backend".to_string())
    );

    match state.email_provider.send_welcome_email(
        test_email,
        from_email,
        "Test User"
    ).await {
        Ok(_) => Ok(Json(json!({
            "status": "success",
            "message": "Test email sent successfully"
        }))),
        Err(e) => {
            tracing::error!("Failed to send test email: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
