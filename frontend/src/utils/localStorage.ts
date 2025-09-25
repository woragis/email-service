/**
 * localStorage utility functions for managing browser localStorage
 * Provides safe localStorage handling with error handling and SSR support
 */

export interface StorageOptions {
  serialize?: boolean; // Whether to JSON serialize/deserialize values
}

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Set a value in localStorage
 */
export const setLocalStorageItem = (
  key: string,
  value: any,
  options: StorageOptions = { serialize: true }
): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const serializedValue = options.serialize ? JSON.stringify(value) : value;
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Failed to set localStorage item:', error);
    return false;
  }
};

/**
 * Get a value from localStorage
 */
export const getLocalStorageItem = <T = any>(
  key: string,
  options: StorageOptions = { serialize: true }
): T | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }

    return options.serialize ? JSON.parse(item) : (item as T);
  } catch (error) {
    console.error('Failed to get localStorage item:', error);
    return null;
  }
};

/**
 * Remove a value from localStorage
 */
export const removeLocalStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove localStorage item:', error);
    return false;
  }
};

/**
 * Check if a key exists in localStorage
 */
export const hasLocalStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  return localStorage.getItem(key) !== null;
};

/**
 * Get all localStorage keys
 */
export const getLocalStorageKeys = (): string[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Failed to get localStorage keys:', error);
    return [];
  }
};

/**
 * Clear all localStorage items
 */
export const clearLocalStorage = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

/**
 * Get localStorage size in bytes (approximate)
 */
export const getLocalStorageSize = (): number => {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error('Failed to calculate localStorage size:', error);
    return 0;
  }
};

/**
 * Application-specific localStorage helpers
 */
export const appStorage = {
  /**
   * Store user preferences
   */
  setPreferences: (preferences: Record<string, any>): boolean => {
    return setLocalStorageItem('app_preferences', preferences);
  },

  /**
   * Get user preferences
   */
  getPreferences: (): Record<string, any> | null => {
    return getLocalStorageItem('app_preferences');
  },

  /**
   * Store theme preference
   */
  setTheme: (theme: string): boolean => {
    return setLocalStorageItem('app_theme', theme, { serialize: false });
  },

  /**
   * Get theme preference
   */
  getTheme: (): string | null => {
    return getLocalStorageItem('app_theme', { serialize: false });
  },

  /**
   * Store recent searches
   */
  setRecentSearches: (searches: string[]): boolean => {
    return setLocalStorageItem('recent_searches', searches);
  },

  /**
   * Get recent searches
   */
  getRecentSearches: (): string[] | null => {
    return getLocalStorageItem('recent_searches');
  },

  /**
   * Store draft content
   */
  setDraft: (key: string, content: any): boolean => {
    return setLocalStorageItem(`draft_${key}`, content);
  },

  /**
   * Get draft content
   */
  getDraft: (key: string): any => {
    return getLocalStorageItem(`draft_${key}`);
  },

  /**
   * Remove draft content
   */
  removeDraft: (key: string): boolean => {
    return removeLocalStorageItem(`draft_${key}`);
  },

  /**
   * Clear all app-specific data
   */
  clearAppData: (): boolean => {
    const keys = getLocalStorageKeys();
    const appKeys = keys.filter(key => 
      key.startsWith('app_') || 
      key.startsWith('draft_') || 
      key === 'recent_searches'
    );

    let success = true;
    appKeys.forEach(key => {
      if (!removeLocalStorageItem(key)) {
        success = false;
      }
    });

    return success;
  },
};
