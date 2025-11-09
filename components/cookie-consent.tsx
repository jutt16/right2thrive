"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Cookie, 
  Settings, 
  Check, 
  X, 
  Shield, 
  BarChart3, 
  Eye,
  Info
} from "lucide-react"
import Link from "next/link"

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
}

interface CookieConsentProps {
  onConsentChange?: (preferences: CookiePreferences) => void
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const consent = localStorage.getItem('cookie-consent')
      if (!consent) {
        setShowBanner(true)
      } else {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
        // Apply saved preferences
        applyCookiePreferences(savedPreferences)
      }
    } catch (error) {
      console.warn('Failed to load cookie preferences:', error)
      setShowBanner(true)
    }
  }, [])

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Enable/disable Google Analytics based on consent
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (prefs.analytics) {
          // Enable Google Analytics
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted'
          })
        } else {
          // Disable Google Analytics
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied'
          })
        }
      } catch (error) {
        console.warn('Failed to update Google Analytics consent:', error)
      }
    }
  }

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(prefs))
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      applyCookiePreferences(prefs)
      setShowBanner(false)
      setShowSettings(false)
      onConsentChange?.(prefs)
    } catch (error) {
      console.warn('Failed to save cookie preferences:', error)
      // Still update UI even if localStorage fails
      setShowBanner(false)
      setShowSettings(false)
      onConsentChange?.(prefs)
    }
  }

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      functional: true
    }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false
    }
    setPreferences(essentialOnly)
    saveConsent(essentialOnly)
  }

  const saveCustomPreferences = () => {
    saveConsent(preferences)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  if (!showBanner && !showSettings) {
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
          <div className="container mx-auto p-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Cookie className="h-8 w-8 text-[#00990d]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      We use cookies to improve your experience
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We use essential cookies to make our site work. We'd also like to set analytics cookies 
                      to help us improve it. We won't set optional cookies unless you enable them. 
                      <Link href="/privacy-policy#cookies-analytics" className="text-[#00990d] underline ml-1">
                        Learn more in our Privacy Policy
                      </Link>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={acceptEssential} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-1" />
                        Essential Only
                      </Button>
                      <Button onClick={acceptAll} size="sm" className="bg-[#00990d] hover:bg-green-700">
                        <Check className="h-4 w-4 mr-1" />
                        Accept All
                      </Button>
                      <Button onClick={openSettings} variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Cookie Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cookie Settings
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={closeSettings}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Manage your cookie preferences. You can enable or disable different types of cookies below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-base font-medium">Essential Cookies</Label>
                      <p className="text-sm text-gray-600">
                        Required for the website to function properly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Always Active
                    </Badge>
                    <Switch checked={true} disabled />
                  </div>
                </div>
                <div className="ml-8 text-sm text-gray-600">
                  <p>These cookies are necessary for the website to function and cannot be switched off:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Authentication cookies (keep you logged in)</li>
                    <li>Security cookies (protect against attacks)</li>
                    <li>Preference cookies (remember your settings)</li>
                  </ul>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-base font-medium">Analytics Cookies</Label>
                      <p className="text-sm text-gray-600">
                        Help us understand how visitors interact with our website
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.analytics} 
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>
                <div className="ml-8 text-sm text-gray-600">
                  <p>These cookies collect information about how you use our website:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Google Analytics (page views, user behavior)</li>
                    <li>Performance monitoring (website speed, errors)</li>
                    <li>Usage statistics (features used, time spent)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <strong>Data retention:</strong> 26 months (Google Analytics default)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-base font-medium">Functional Cookies</Label>
                      <p className="text-sm text-gray-600">
                        Enable enhanced functionality and personalization
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.functional} 
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, functional: checked }))
                    }
                  />
                </div>
                <div className="ml-8 text-sm text-gray-600">
                  <p>These cookies enable enhanced features and personalization:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Language preferences</li>
                    <li>Theme settings (dark/light mode)</li>
                    <li>Customized content recommendations</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button onClick={saveCustomPreferences} className="bg-[#00990d] hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Save Preferences
                </Button>
                <Button onClick={acceptAll} variant="outline">
                  Accept All Cookies
                </Button>
                <Button onClick={acceptEssential} variant="outline">
                  Essential Only
                </Button>
              </div>

              {/* Privacy Policy Link */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  For more information about how we use cookies, please read our{" "}
                  <Link href="/privacy-policy#cookies-analytics" className="text-[#00990d] underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
