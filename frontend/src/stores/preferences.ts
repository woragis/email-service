import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, DEFAULT_PREFERENCES } from '../types/preferences';

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setEmailUIStyle: (style: UserPreferences['emailUIStyle']) => void;
  updateLayout: (layout: Partial<UserPreferences['layout']>) => void;
  updateEmailDisplay: (display: Partial<UserPreferences['emailDisplay']>) => void;
  updateFeatures: (features: Partial<UserPreferences['features']>) => void;
  updatePrivacy: (privacy: Partial<UserPreferences['privacy']>) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      resetPreferences: () =>
        set({ preferences: DEFAULT_PREFERENCES }),

      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      setEmailUIStyle: (emailUIStyle) =>
        set((state) => ({
          preferences: { ...state.preferences, emailUIStyle },
        })),

      updateLayout: (layout) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            layout: { ...state.preferences.layout, ...layout },
          },
        })),

      updateEmailDisplay: (emailDisplay) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            emailDisplay: { ...state.preferences.emailDisplay, ...emailDisplay },
          },
        })),

      updateFeatures: (features) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            features: { ...state.preferences.features, ...features },
          },
        })),

      updatePrivacy: (privacy) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            privacy: { ...state.preferences.privacy, ...privacy },
          },
        })),
    }),
    {
      name: 'email-preferences',
      version: 1,
    }
  )
);
