"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  FaCookie, 
  FaCog, 
  FaCheck, 
  FaTimes, 
  FaShieldAlt, 
  FaChartBar, 
  FaEye,
  FaInfoCircle,
  FaLock,
  FaGlobe
} from "react-icons/fa"
import Link from "next/link"

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

interface CookieConsentProps {
  onConsentChange?: (preferences: CookiePreferences) => void
}

export default function GDPRCompliantCookieConsent({ onConsentChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const consent = localStorage.getItem('gdpr-cookie-consent')
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
            'analytics_storage': 'granted',
            'ad_storage': prefs.marketing ? 'granted' : 'denied'
          })
        } else {
          // Disable Google Analytics
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied'
          })
        }
      } catch (error) {
        console.warn('Failed to update Google Analytics consent:', error)
      }
    }
  }

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('gdpr-cookie-consent', JSON.stringify(prefs))
      localStorage.setItem('gdpr-cookie-consent-date', new Date().toISOString())
      localStorage.setItem('gdpr-cookie-consent-version', '1.0')
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
      functional: true,
      marketing: true
    }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false
    }
    setPreferences(essentialOnly)
    saveConsent(essentialOnly)
  }

  const saveCustomPreferences = () => {
    saveConsent(preferences)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FaCookie className="h-6 w-6 text-orange-500" />
            <div>
              <CardTitle>Cookie Preferences & Privacy</CardTitle>
              <CardDescription>
                We use cookies to enhance your experience and analyze site usage. 
                You can choose which cookies to accept.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-2">Your Privacy Matters</p>
                <p className="text-blue-800">
                  We are committed to protecting your privacy and ensuring your data is handled securely. 
                  Essential cookies are required for the website to function, while other cookies help us 
                  improve your experience and understand how you use our services.
                </p>
                <p className="text-blue-800 mt-2">
                  <Link href="/privacy" className="underline hover:no-underline">
                    Read our full Privacy Policy
                  </Link> for more information about how we process your data.
                </p>
              </div>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="h-5 w-5 text-green-600" />
                  <div>
                    <Label className="text-base font-medium">Essential Cookies</Label>
                    <p className="text-sm text-gray-600">
                      Required for the website to function properly and securely
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
                  <li>Session cookies (maintain your session)</li>
                </ul>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaChartBar className="h-5 w-5 text-blue-600" />
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
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCog className="h-5 w-5 text-purple-600" />
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
                <p>These cookies enable enhanced functionality:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Language preferences</li>
                  <li>Accessibility settings</li>
                  <li>Customized content</li>
                  <li>Remember form data</li>
                </ul>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaGlobe className="h-5 w-5 text-orange-600" />
                  <div>
                    <Label className="text-base font-medium">Marketing Cookies</Label>
                    <p className="text-sm text-gray-600">
                      Used to deliver relevant advertisements and track campaign performance
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.marketing} 
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
              <div className="ml-8 text-sm text-gray-600">
                <p>These cookies are used for advertising purposes:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Social media integration</li>
                  <li>Advertising networks</li>
                  <li>Campaign tracking</li>
                  <li>Remarketing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Processing Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaLock className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-2">Data Processing Information</p>
                <div className="text-gray-700 space-y-1">
                  <p><strong>Data Controller:</strong> Right2Thrive UK</p>
                  <p><strong>Legal Basis:</strong> Legitimate interest (analytics), Consent (marketing)</p>
                  <p><strong>Data Retention:</strong> Up to 2 years for analytics, until consent withdrawn for marketing</p>
                  <p><strong>Your Rights:</strong> You can withdraw consent, access your data, or request deletion at any time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={acceptEssential}
              className="flex-1"
            >
              <FaTimes className="h-4 w-4 mr-2" />
              Essential Only
            </Button>
            <Button
              onClick={saveCustomPreferences}
              className="flex-1"
            >
              <FaCog className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
            <Button
              onClick={acceptAll}
              className="flex-1 bg-[#00990d] text-white hover:bg-[#007a0a]"
            >
              <FaCheck className="h-4 w-4 mr-2" />
              Accept All
            </Button>
          </div>

          {/* Contact Information */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Questions about our cookie policy? 
              <Link href="/contact?subject=Cookie Policy Question" className="text-blue-600 hover:underline ml-1">
                Contact us
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
