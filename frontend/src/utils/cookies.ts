/**
 * Cookie utility functions for managing browser cookies
 * Provides secure cookie handling with proper options
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  maxAge?: number; // seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof document === 'undefined') {
    return; // SSR safety
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Handle expires
  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  }

  // Handle maxAge
  if (options.maxAge !== undefined) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  // Handle path
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  // Handle domain
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  // Handle secure
  if (options.secure) {
    cookieString += '; secure';
  }

  // Handle httpOnly
  if (options.httpOnly) {
    cookieString += '; httponly';
  }

  // Handle sameSite
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null; // SSR safety
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Remove a cookie by setting its expiration date to the past
 */
export const removeCookie = (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') {
    return {}; // SSR safety
  }

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie) {
      const [name, value] = cookie.split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }
  }

  return cookies;
};

/**
 * Clear all cookies (use with caution!)
 */
export const clearAllCookies = (): void => {
  if (typeof document === 'undefined') {
    return; // SSR safety
  }

  const cookies = getAllCookies();
  Object.keys(cookies).forEach(name => {
    removeCookie(name);
  });
};

/**
 * Auth-specific cookie helpers
 */
export const authCookies = {
  /**
   * Set auth token cookie with secure defaults
   */
  setToken: (token: string): void => {
    setCookie('auth_token', token, {
      expires: 7, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },

  /**
   * Get auth token from cookie
   */
  getToken: (): string | null => {
    return getCookie('auth_token');
  },

  /**
   * Remove auth token cookie
   */
  removeToken: (): void => {
    removeCookie('auth_token', { path: '/' });
  },

  /**
   * Check if auth token exists
   */
  hasToken: (): boolean => {
    return hasCookie('auth_token');
  },
};
