// Cookie management utilities for GDPR compliance

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
}

export interface CookieInfo {
  name: string
  category: 'essential' | 'analytics' | 'functional'
  purpose: string
  retention: string
  provider?: string
}

export const COOKIE_DEFINITIONS: CookieInfo[] = [
  // Essential Cookies
  {
    name: 'auth-token',
    category: 'essential',
    purpose: 'Keeps you logged in to your account',
    retention: 'Session'
  },
  {
    name: 'csrf-token',
    category: 'essential',
    purpose: 'Protects against cross-site request forgery attacks',
    retention: 'Session'
  },
  {
    name: 'cookie-consent',
    category: 'essential',
    purpose: 'Remembers your cookie preferences',
    retention: '1 year'
  },
  {
    name: 'theme-preference',
    category: 'essential',
    purpose: 'Remembers your theme preference (light/dark)',
    retention: '1 year'
  },

  // Analytics Cookies
  {
    name: '_ga',
    category: 'analytics',
    purpose: 'Google Analytics - distinguishes users',
    retention: '2 years',
    provider: 'Google'
  },
  {
    name: '_ga_*',
    category: 'analytics',
    purpose: 'Google Analytics - stores session state',
    retention: '2 years',
    provider: 'Google'
  },
  {
    name: '_gid',
    category: 'analytics',
    purpose: 'Google Analytics - distinguishes users',
    retention: '24 hours',
    provider: 'Google'
  },

  // Functional Cookies
  {
    name: 'language-preference',
    category: 'functional',
    purpose: 'Remembers your language preference',
    retention: '1 year'
  },
  {
    name: 'accessibility-settings',
    category: 'functional',
    purpose: 'Remembers your accessibility preferences',
    retention: '1 year'
  }
]

export class CookieManager {
  private static instance: CookieManager
  private preferences: CookiePreferences | null = null

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager()
    }
    return CookieManager.instance
  }

  // Initialize cookie manager
  init(): void {
    this.loadPreferences()
    this.applyPreferences()
  }

  // Load saved preferences from localStorage
  loadPreferences(): void {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem('cookie-consent')
      if (saved) {
        this.preferences = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error)
      this.preferences = {
        essential: true,
        analytics: false,
        functional: false
      }
    }
  }

  // Save preferences to localStorage
  savePreferences(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('cookie-consent', JSON.stringify(preferences))
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      this.preferences = preferences
      this.applyPreferences()
    } catch (error) {
      console.error('Error saving cookie preferences:', error)
    }
  }

  // Get current preferences
  getPreferences(): CookiePreferences | null {
    return this.preferences
  }

  // Check if user has given consent
  hasConsent(): boolean {
    return this.preferences !== null
  }

  // Check if specific category is allowed
  isCategoryAllowed(category: keyof CookiePreferences): boolean {
    if (!this.preferences) return false
    return this.preferences[category]
  }

  // Apply preferences to Google Analytics
  applyPreferences(): void {
    if (typeof window === 'undefined' || !this.preferences) return

    // Configure Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'default', {
        'analytics_storage': this.preferences.analytics ? 'granted' : 'denied',
        'functionality_storage': this.preferences.functional ? 'granted' : 'denied',
        'security_storage': 'granted' // Always granted for essential cookies
      })
    }
  }

  // Delete cookies by category
  deleteCookiesByCategory(category: keyof CookiePreferences): void {
    if (typeof window === 'undefined') return

    const cookiesToDelete = COOKIE_DEFINITIONS.filter(
      cookie => cookie.category === category
    )

    cookiesToDelete.forEach(cookie => {
      // Delete exact match
      document.cookie = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      
      // Delete with wildcard (for Google Analytics cookies)
      if (cookie.name.includes('*')) {
        const baseName = cookie.name.replace('*', '')
        // This is a simplified approach - in practice, you'd need to iterate through all cookies
        document.cookie = `${baseName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })
  }

  // Get all cookies for display
  getAllCookies(): CookieInfo[] {
    return COOKIE_DEFINITIONS
  }

  // Get cookies by category
  getCookiesByCategory(category: keyof CookiePreferences): CookieInfo[] {
    return COOKIE_DEFINITIONS.filter(cookie => cookie.category === category)
  }

  // Reset all preferences
  resetPreferences(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-date')
    this.preferences = null
  }
}

// Global instance
export const cookieManager = CookieManager.getInstance()

// Utility functions
export const getCookieConsentDate = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cookie-consent-date')
}

export const getDaysSinceConsent = (): number | null => {
  const consentDate = getCookieConsentDate()
  if (!consentDate) return null
  
  const consent = new Date(consentDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - consent.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
