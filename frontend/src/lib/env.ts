/**
 * Environment configuration for the Jazz Melodic frontend application
 * This class centralizes all environment variables and provides type safety
 */

export interface EnvironmentConfig {
  // Required properties
  apiUrl: string;
  backendUrl: string;
  
  // Optional properties
  nodeEnv?: string;
  appUrl?: string;
  authProvider?: string;
  googleClientId?: string;
  githubClientId?: string;
  stripePublishableKey?: string;
  analyticsId?: string;
  sentryDsn?: string;
  enableAnalytics?: boolean;
  enableDebug?: boolean;
  enableMaintenanceMode?: boolean;
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  cdnUrl?: string;
  imagesUrl?: string;
  apiTimeout?: number;
  maxFileSize?: number;
  cspNonce?: string;
  databaseUrl?: string;
}

export class Environment {
  // Required properties
  public readonly apiUrl: string;
  public readonly backendUrl: string;
  
  // Optional properties with defaults
  public readonly nodeEnv: string;
  public readonly appUrl: string;
  public readonly authProvider: string;
  public readonly googleClientId?: string;
  public readonly githubClientId?: string;
  public readonly stripePublishableKey?: string;
  public readonly analyticsId?: string;
  public readonly sentryDsn?: string;
  public readonly enableAnalytics: boolean;
  public readonly enableDebug: boolean;
  public readonly enableMaintenanceMode: boolean;
  public readonly siteName: string;
  public readonly siteDescription: string;
  public readonly siteUrl: string;
  public readonly cdnUrl: string;
  public readonly imagesUrl: string;
  public readonly apiTimeout: number;
  public readonly maxFileSize: number;
  public readonly cspNonce: string;
  public readonly databaseUrl?: string;

  // Computed properties
  public get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  public get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  constructor(config?: Partial<EnvironmentConfig>) {
    // Required properties - these must be provided or will throw an error
    this.apiUrl = config?.apiUrl || process.env.NEXT_PUBLIC_API_URL || '';
    this.backendUrl = config?.backendUrl || process.env.NEXT_PUBLIC_BACKEND_URL || '';

    // Validate required properties
    this.validateRequired();

    // Optional properties with defaults
    this.nodeEnv = config?.nodeEnv || process.env.NODE_ENV || 'development';
    this.appUrl = config?.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    this.authProvider = config?.authProvider || process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'local';
    this.googleClientId = config?.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    this.githubClientId = config?.githubClientId || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    this.stripePublishableKey = config?.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    this.analyticsId = config?.analyticsId || process.env.NEXT_PUBLIC_ANALYTICS_ID;
    this.sentryDsn = config?.sentryDsn || process.env.NEXT_PUBLIC_SENTRY_DSN;
    this.enableAnalytics = config?.enableAnalytics ?? (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true');
    this.enableDebug = config?.enableDebug ?? (process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true');
    this.enableMaintenanceMode = config?.enableMaintenanceMode ?? (process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === 'true');
    this.siteName = config?.siteName || process.env.NEXT_PUBLIC_SITE_NAME || 'Jazz Melodic';
    this.siteDescription = config?.siteDescription || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Where Technique Meets Artistry';
    this.siteUrl = config?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://jazzmelodic.com';
    this.cdnUrl = config?.cdnUrl || process.env.NEXT_PUBLIC_CDN_URL || '';
    this.imagesUrl = config?.imagesUrl || process.env.NEXT_PUBLIC_IMAGES_URL || '';
    this.apiTimeout = config?.apiTimeout || parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);
    this.maxFileSize = config?.maxFileSize || parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760', 10); // 10MB
    this.cspNonce = config?.cspNonce || process.env.NEXT_PUBLIC_CSP_NONCE || '';
    this.databaseUrl = config?.databaseUrl || process.env.NEXT_PUBLIC_DATABASE_URL;
  }

  /**
   * Validate required environment variables
   * Throws an error if any required variables are missing
   */
  private validateRequired(): void {
    const requiredVars = [
      { name: 'NEXT_PUBLIC_API_URL', value: this.apiUrl },
      { name: 'NEXT_PUBLIC_BACKEND_URL', value: this.backendUrl },
    ];

    const missingVars = requiredVars.filter(({ value }) => !value);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars
          .map(({ name }) => name)
          .join(', ')}`
      );
    }
  }

  /**
   * Get API endpoint URL
   */
  public getApiUrl(endpoint: string = ''): string {
    const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Get backend URL for server-side operations
   */
  public getBackendUrl(endpoint: string = ''): string {
    const baseUrl = this.backendUrl.endsWith('/') ? this.backendUrl.slice(0, -1) : this.backendUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Check if a feature is enabled
   */
  public isFeatureEnabled(feature: 'analytics' | 'debug' | 'maintenance'): boolean {
    switch (feature) {
      case 'analytics':
        return this.enableAnalytics;
      case 'debug':
        return this.enableDebug && this.isDevelopment;
      case 'maintenance':
        return this.enableMaintenanceMode;
      default:
        return false;
    }
  }

  /**
   * Get CDN URL for assets
   */
  public getAssetUrl(path: string): string {
    if (!path) return '';
    const baseUrl = this.cdnUrl || this.imagesUrl || '';
    if (!baseUrl) return path;
    
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBaseUrl}${cleanPath}`;
  }

  /**
   * Get all configuration as a plain object
   */
  public toObject(): Record<string, unknown> {
    return {
      nodeEnv: this.nodeEnv,
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
      appUrl: this.appUrl,
      apiUrl: this.apiUrl,
      backendUrl: this.backendUrl,
      authProvider: this.authProvider,
      googleClientId: this.googleClientId,
      githubClientId: this.githubClientId,
      stripePublishableKey: this.stripePublishableKey,
      analyticsId: this.analyticsId,
      sentryDsn: this.sentryDsn,
      enableAnalytics: this.enableAnalytics,
      enableDebug: this.enableDebug,
      enableMaintenanceMode: this.enableMaintenanceMode,
      siteName: this.siteName,
      siteDescription: this.siteDescription,
      siteUrl: this.siteUrl,
      cdnUrl: this.cdnUrl,
      imagesUrl: this.imagesUrl,
      apiTimeout: this.apiTimeout,
      maxFileSize: this.maxFileSize,
      cspNonce: this.cspNonce,
      databaseUrl: this.databaseUrl,
    };
  }
}

// Create and export a singleton instance
export const env = new Environment();
