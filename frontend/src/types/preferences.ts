// User UI Preferences Types
export interface UserPreferences {
  // Theme preferences
  theme: 'light' | 'dark';
  
  // Email UI Style
  emailUIStyle: 'gmail-classic' | 'outlook-advanced' | 'apple-minimal' | 'proton-privacy';
  
  // Layout preferences
  layout: {
    sidebarWidth: number;
    emailListWidth: number;
    showPreview: boolean;
    compactMode: boolean;
  };
  
  // Email display preferences
  emailDisplay: {
    density: 'comfortable' | 'cozy' | 'compact';
    showImages: boolean;
    showQuotedText: boolean;
    conversationView: boolean;
  };
  
  // Advanced features
  features: {
    keyboardShortcuts: boolean;
    autoSave: boolean;
    readReceipts: boolean;
    scheduledSending: boolean;
    templates: boolean;
  };
  
  // Privacy settings
  privacy: {
    trackOpens: boolean;
    trackClicks: boolean;
    encryptEmails: boolean;
    autoDelete: boolean;
  };
}

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  emailUIStyle: 'gmail-classic',
  layout: {
    sidebarWidth: 250,
    emailListWidth: 400,
    showPreview: true,
    compactMode: false,
  },
  emailDisplay: {
    density: 'comfortable',
    showImages: true,
    showQuotedText: true,
    conversationView: true,
  },
  features: {
    keyboardShortcuts: true,
    autoSave: true,
    readReceipts: false,
    scheduledSending: true,
    templates: true,
  },
  privacy: {
    trackOpens: false,
    trackClicks: false,
    encryptEmails: false,
    autoDelete: false,
  },
};

// UI Style configurations
export interface UIStyleConfig {
  name: string;
  description: string;
  layout: 'three-panel' | 'two-panel' | 'single-panel';
  features: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export const UI_STYLE_CONFIGS: Record<UserPreferences['emailUIStyle'], UIStyleConfig> = {
  'gmail-classic': {
    name: 'Gmail Classic',
    description: 'Traditional three-panel layout with familiar Gmail-style interface',
    layout: 'three-panel',
    features: ['Labels', 'Smart Categories', 'Conversation View', 'Search'],
    colorScheme: {
      primary: '#1a73e8',
      secondary: '#34a853',
      accent: '#fbbc04',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#202124',
    },
  },
  'outlook-advanced': {
    name: 'Outlook Advanced',
    description: 'Feature-rich interface with advanced organization and productivity tools',
    layout: 'three-panel',
    features: ['Folders', 'Rules', 'Categories', 'Calendar Integration', 'Tasks'],
    colorScheme: {
      primary: '#0078d4',
      secondary: '#107c10',
      accent: '#ff8c00',
      background: '#ffffff',
      surface: '#f3f2f1',
      text: '#323130',
    },
  },
  'apple-minimal': {
    name: 'Apple Minimal',
    description: 'Clean, minimal design with focus on simplicity and elegance',
    layout: 'two-panel',
    features: ['Smart Mailboxes', 'VIP', 'Flagged', 'Minimal Interface'],
    colorScheme: {
      primary: '#007aff',
      secondary: '#30d158',
      accent: '#ff9f0a',
      background: '#ffffff',
      surface: '#f2f2f7',
      text: '#1d1d1f',
    },
  },
  'proton-privacy': {
    name: 'Proton Privacy',
    description: 'Privacy-focused interface with encryption and security features',
    layout: 'three-panel',
    features: ['End-to-End Encryption', 'Secure Sharing', 'Self-Destructing', 'Privacy Controls'],
    colorScheme: {
      primary: '#6d4aff',
      secondary: '#00d4aa',
      accent: '#ff6b35',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#1a1a1a',
    },
  },
};

// Theme CSS file mappings
export const THEME_CSS_MAPPING: Record<UserPreferences['emailUIStyle'], string> = {
  'gmail-classic': '/styles/email/gmail-classic.css',
  'outlook-advanced': '/styles/email/outlook-advanced.css',
  'apple-minimal': '/styles/email/apple-minimal.css',
  'proton-privacy': '/styles/email/proton-privacy.css',
};

// Dark mode CSS file mappings
export const DARK_THEME_CSS_MAPPING: Record<UserPreferences['emailUIStyle'], string> = {
  'gmail-classic': '/styles/email/gmail-classic-dark.css',
  'outlook-advanced': '/styles/email/outlook-advanced-dark.css',
  'apple-minimal': '/styles/email/apple-minimal-dark.css',
  'proton-privacy': '/styles/email/proton-privacy-dark.css',
};
