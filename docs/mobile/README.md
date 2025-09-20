# Mobile Documentation

## 📱 Mobile App Architecture

The mobile application provides a native experience across iOS and Android platforms using cross-platform or native development frameworks.

```
src/
├── components/           # Reusable UI components
├── screens/             # Screen components
├── navigation/          # Navigation configuration
├── services/            # API services
├── store/               # State management
├── utils/               # Utility functions
├── types/               # Type definitions
├── assets/              # Images, fonts, etc.
└── styles/              # Global styles
```

## 🧭 Navigation & Routing

### Navigation Structure
**Main Navigation Flow:**
```
App Navigator:
├── If Authenticated:
│   └── Tab Navigator
│       ├── Dashboard (Home Icon)
│       ├── Emails (Mail Icon)
│       ├── Templates (Template Icon)
│       ├── Campaigns (Campaign Icon)
│       └── Profile (User Icon)
└── If Not Authenticated:
    └── Auth Stack
        ├── Login Screen
        ├── Register Screen
        └── Forgot Password Screen
```

### Screen Routes

#### 1. Authentication Screens
```typescript
// Login Screen
interface LoginScreenProps {
  navigation: NavigationProp<AuthStackParamList, 'Login'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

#### 2. Main App Screens

##### Dashboard Screen
```typescript
const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useDashboardStats();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.firstName}!</Text>
        <Text style={styles.subtitle}>Here's your email overview</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <StatCard title="Emails Sent" value={stats.emailsSent} icon="mail" />
        <StatCard title="Success Rate" value={`${stats.successRate}%`} icon="check" />
        <StatCard title="Open Rate" value={`${stats.openRate}%`} icon="eye" />
        <StatCard title="Click Rate" value={`${stats.clickRate}%`} icon="cursor" />
      </View>
      
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Send Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Create Campaign</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {stats.recentEmails.map(email => (
          <ActivityItem key={email.id} email={email} />
        ))}
      </View>
    </ScrollView>
  );
};
```

##### Email Screen
```typescript
const EmailScreen: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadEmails = async () => {
    try {
      const data = await emailService.getEmails();
      setEmails(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load emails');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadEmails();
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={emails}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <EmailItem email={item} onPress={() => handleEmailPress(item)} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No emails found</Text>
          </View>
        )}
      />
    </View>
  );
};
```

##### Templates Screen
```typescript
const TemplatesScreen: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TemplateCard template={item} onPress={() => handleTemplatePress(item)} />
        )}
      />
    </View>
  );
};
```

## 🧩 Mobile Components

### Reusable Components

#### 1. Email Components
```typescript
// EmailItem - Display email in list
interface EmailItemProps {
  email: Email;
  onPress: () => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, onPress }) => (
  <TouchableOpacity style={styles.emailItem} onPress={onPress}>
    <View style={styles.emailHeader}>
      <Text style={styles.emailSubject}>{email.subject}</Text>
      <Text style={styles.emailDate}>{formatDate(email.createdAt)}</Text>
    </View>
    <Text style={styles.emailRecipient}>To: {email.recipient}</Text>
    <View style={styles.emailStatus}>
      <StatusBadge status={email.status} />
    </View>
  </TouchableOpacity>
);

// EmailForm - Send email form
interface EmailFormProps {
  onSubmit: (emailData: EmailData) => void;
  template?: Template;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, template }) => {
  const [formData, setFormData] = useState<EmailData>({
    to: '',
    subject: template?.subject || '',
    content: template?.htmlContent || '',
  });
  
  return (
    <ScrollView style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Recipient Email"
        value={formData.to}
        onChangeText={(text) => setFormData({...formData, to: text})}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={formData.subject}
        onChangeText={(text) => setFormData({...formData, subject: text})}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Email Content"
        value={formData.content}
        onChangeText={(text) => setFormData({...formData, content: text})}
        multiline
        numberOfLines={10}
      />
      <TouchableOpacity 
        style={styles.sendButton} 
        onPress={() => onSubmit(formData)}
      >
        <Text style={styles.sendButtonText}>Send Email</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

#### 2. Template Components
```typescript
// TemplateCard - Display template in grid
interface TemplateCardProps {
  template: Template;
  onPress: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPress }) => (
  <TouchableOpacity style={styles.templateCard} onPress={onPress}>
    <View style={styles.templatePreview}>
      <Text style={styles.templateName}>{template.name}</Text>
      <Text style={styles.templateSubject}>{template.subject}</Text>
    </View>
    <View style={styles.templateMeta}>
      <Text style={styles.templateCategory}>{template.category}</Text>
      <Text style={styles.templateDate}>{formatDate(template.updatedAt)}</Text>
    </View>
  </TouchableOpacity>
);
```

#### 3. Analytics Components
```typescript
// StatCard - Display metric
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Icon name={icon} size={24} color="#3b82f6" />
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {trend && (
      <View style={styles.statTrend}>
        <Icon 
          name={trend === 'up' ? 'trending-up' : 'trending-down'} 
          size={16} 
          color={trend === 'up' ? '#10b981' : '#ef4444'} 
        />
      </View>
    )}
  </View>
);

// ChartComponent - Display charts
interface ChartComponentProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'pie';
  height?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, type, height = 200 }) => (
  <View style={[styles.chartContainer, { height }]}>
    {type === 'line' && <LineChart data={data} />}
    {type === 'bar' && <BarChart data={data} />}
    {type === 'pie' && <PieChart data={data} />}
  </View>
);
```

## 🔔 Push Notifications

### Notification Setup
```typescript
// Notification service
class NotificationService {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }
  
  async scheduleLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  }
  
  async registerForPushNotifications() {
    const token = await Notifications.getExpoPushTokenAsync();
    // Send token to backend
    await apiService.registerPushToken(token.data);
  }
}

// Notification handlers
const handleNotification = (notification: Notification) => {
  const { type, data } = notification.request.content.data;
  
  switch (type) {
    case 'email_sent':
      navigation.navigate('Emails');
      break;
    case 'campaign_completed':
      navigation.navigate('Campaigns');
      break;
    case 'provider_error':
      navigation.navigate('Settings');
      break;
  }
};
```

## 📱 Native Features

### Camera Integration
```typescript
// Image picker for email attachments
const useImagePicker = () => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };
  
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };
  
  return { pickImage, takePhoto };
};
```

### File System
```typescript
// File operations
const useFileSystem = () => {
  const saveTemplate = async (template: Template) => {
    const fileName = `${template.name}.json`;
    const fileUri = FileSystem.documentDirectory + fileName;
    
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(template),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    return fileUri;
  };
  
  const loadTemplate = async (fileUri: string) => {
    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
  };
  
  return { saveTemplate, loadTemplate };
};
```

### Biometric Authentication
```typescript
// Biometric authentication
const useBiometricAuth = () => {
  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access your emails',
      fallbackLabel: 'Use Passcode',
    });
    
    return result.success;
  };
  
  const isBiometricAvailable = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    return compatible && enrolled;
  };
  
  return { authenticate, isBiometricAvailable };
};
```

## 🔄 State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;
  emails: EmailState;
  templates: TemplateState;
  campaigns: CampaignState;
  notifications: NotificationState;
  offline: OfflineState;
}

// Auth slice
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  biometricEnabled: boolean;
  loading: boolean;
  error: string | null;
}

// Email slice
interface EmailState {
  emails: Email[];
  selectedEmail: Email | null;
  filters: EmailFilters;
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
}
```

### Custom Hooks
```typescript
// useOfflineSync hook
const useOfflineSync = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useNetInfo();
  
  useEffect(() => {
    if (isConnected) {
      // Sync offline data when connection is restored
      dispatch(syncOfflineData());
    }
  }, [isConnected, dispatch]);
  
  const syncOfflineData = async () => {
    const offlineEmails = await AsyncStorage.getItem('offline_emails');
    if (offlineEmails) {
      const emails = JSON.parse(offlineEmails);
      // Send offline emails to server
      for (const email of emails) {
        try {
          await emailService.sendEmail(email);
          await AsyncStorage.removeItem('offline_emails');
        } catch (error) {
          console.error('Failed to sync email:', error);
        }
      }
    }
  };
};
```

## 📊 Offline Support

### Offline Data Management
```typescript
// Offline storage
const useOfflineStorage = () => {
  const storeData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  };
  
  const getData = async (key: string) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get data:', error);
      return null;
    }
  };
  
  const clearData = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };
  
  return { storeData, getData, clearData };
};

// Offline email queue
const useOfflineEmailQueue = () => {
  const { storeData, getData } = useOfflineStorage();
  const { isConnected } = useNetInfo();
  
  const addToQueue = async (email: EmailData) => {
    const queue = await getData('email_queue') || [];
    queue.push({ ...email, id: Date.now(), offline: true });
    await storeData('email_queue', queue);
  };
  
  const processQueue = async () => {
    if (!isConnected) return;
    
    const queue = await getData('email_queue') || [];
    for (const email of queue) {
      try {
        await emailService.sendEmail(email);
        // Remove from queue after successful send
        const updatedQueue = queue.filter(e => e.id !== email.id);
        await storeData('email_queue', updatedQueue);
      } catch (error) {
        console.error('Failed to send queued email:', error);
      }
    }
  };
  
  return { addToQueue, processQueue };
};
```

## 🧪 Testing Strategy

### Testing Structure
```
__tests__/
├── components/          # Component tests
├── screens/            # Screen tests
├── services/           # Service tests
├── utils/              # Utility tests
├── integration/        # Integration tests
└── e2e/                # E2E tests
```

### Testing Tools
- **Jest** - Unit testing framework
- **React Native Testing Library** - Component testing
- **Detox** - E2E testing
- **MSW** - API mocking

### Test Examples
```typescript
// Component test
describe('EmailItem', () => {
  it('should display email information correctly', () => {
    const email = {
      id: 1,
      subject: 'Test Email',
      recipient: 'test@example.com',
      status: 'sent',
      createdAt: new Date(),
    };
    
    render(<EmailItem email={email} onPress={jest.fn()} />);
    
    expect(screen.getByText('Test Email')).toBeTruthy();
    expect(screen.getByText('test@example.com')).toBeTruthy();
    expect(screen.getByText('sent')).toBeTruthy();
  });
});

// Screen test
describe('LoginScreen', () => {
  it('should handle login successfully', async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    
    render(<LoginScreen />);
    
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
    fireEvent.press(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });
});
```

## 🚀 Build & Deployment

### Build Configuration
```typescript
// Metro config
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

// App config
export default {
  expo: {
    name: "Email Provider",
    slug: "email-provider-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      "expo-notifications",
      "expo-camera",
      "expo-file-system",
      "expo-local-authentication",
    ],
  },
};
```

### Environment Configuration
```typescript
interface EnvironmentConfig {
  EXPO_PUBLIC_API_URL: string;
  EXPO_PUBLIC_APP_NAME: string;
  EXPO_PUBLIC_SENTRY_DSN?: string;
  EXPO_PUBLIC_ANALYTICS_ID?: string;
}
```
