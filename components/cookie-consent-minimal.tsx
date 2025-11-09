"use client"

import { useState, useEffect } from "react"

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
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    functional: false
  })

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent')
      if (!consent) {
        setShowBanner(true)
      } else {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
      }
    } catch (error) {
      console.warn('Failed to load cookie preferences:', error)
      setShowBanner(true)
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(prefs))
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      setShowBanner(false)
      onConsentChange?.(prefs)
    } catch (error) {
      console.warn('Failed to save cookie preferences:', error)
      setShowBanner(false)
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              🍪 We use cookies to enhance your experience
            </h3>
            <p className="text-sm text-gray-600">
              We use essential cookies to make our site work. We'd also like to set analytics cookies to help us improve it.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={acceptEssential}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
