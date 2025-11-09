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
  FaInfoCircle
} from "react-icons/fa"
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

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FaCookie className="h-6 w-6 text-orange-500" />
            <div>
              <CardTitle>Cookie Preferences</CardTitle>
              <CardDescription>
                We use cookies to enhance your experience and analyze site usage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Essential Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaShieldAlt className="h-5 w-5 text-green-600" />
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
              onClick={acceptAll}
              className="flex-1"
            >
              <FaCheck className="h-4 w-4 mr-2" />
              Accept All
            </Button>
          </div>

          {/* Privacy Policy Link */}
          <div className="text-center text-sm text-gray-600">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Learn more about our cookie policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
