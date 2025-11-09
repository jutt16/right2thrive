"use client";

import { useEffect } from 'react';

// Extend Window interface for analytics (dataLayer and gtag)
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics 4 implementation with consent management
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private consentGiven = false;
  private pendingEvents: Array<{ event: string; parameters: any }> = [];

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  // Initialize GA4
  initialize() {
    if (typeof window === 'undefined') return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      (window.dataLayer = window.dataLayer || []).push(arguments);
    };

    // Configure GA4 with consent
    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      // Consent mode configuration
      analytics_storage: 'denied',
      ad_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      
      // Enhanced measurement
      send_page_view: false, // We'll send manually
      
      // Custom parameters
      custom_map: {
        'custom_parameter_1': 'page_category',
        'custom_parameter_2': 'user_type',
      },
    });

    // Check for existing consent
    this.checkExistingConsent();
  }

  // Check for existing consent
  private checkExistingConsent() {
    try {
      const consent = localStorage.getItem('gdpr-cookie-consent');
      if (consent) {
        const preferences = JSON.parse(consent);
        this.updateConsent(preferences);
      }
    } catch (error) {
      console.warn('Failed to check existing consent:', error);
    }
  }

  // Update consent preferences
  updateConsent(preferences: {
    essential: boolean;
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
  }) {
    if (typeof window === 'undefined' || !window.gtag) return;

    this.consentGiven = preferences.analytics;

    // Update consent mode
    window.gtag('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      functionality_storage: preferences.functional ? 'granted' : 'denied',
      personalization_storage: preferences.marketing ? 'granted' : 'denied',
    });

    // Send pending events if consent is now granted
    if (preferences.analytics && this.pendingEvents.length > 0) {
      this.pendingEvents.forEach(({ event, parameters }) => {
        window.gtag(event, parameters);
      });
      this.pendingEvents = [];
    }
  }

  // Track page view
  trackPageView(path: string, title: string, category?: string) {
    if (!this.consentGiven) {
      this.pendingEvents.push({
        event: 'event',
        parameters: {
          event_name: 'page_view',
          page_path: path,
          page_title: title,
          page_category: category || 'general',
        }
      });
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_category: category || 'general',
        page_location: window.location.href,
        page_referrer: document.referrer,
      });
    }
  }

  // Track custom events
  trackEvent(eventName: string, parameters: any = {}) {
    if (!this.consentGiven) {
      this.pendingEvents.push({
        event: 'event',
        parameters: {
          event_name: eventName,
          ...parameters,
        }
      });
      return;
    }

    if (window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        event_category: parameters.category || 'general',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        custom_parameter_1: window.location.pathname,
        custom_parameter_2: navigator.userAgent,
      });
    }
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, errorMessage?: string) {
    this.trackEvent('form_submit', {
      form_name: formName,
      form_success: success,
      form_error: errorMessage || '',
      category: 'form',
      label: `${formName}_${success ? 'success' : 'error'}`,
    });
  }

  // Track CTA clicks
  trackCTAClick(ctaText: string, location: string, destination: string) {
    this.trackEvent('cta_click', {
      cta_text: ctaText,
      cta_location: location,
      cta_destination: destination,
      category: 'engagement',
      label: `${ctaText}_${location}`,
    });
  }

  // Track user engagement
  trackEngagement(action: string, element: string, value?: number) {
    this.trackEvent('user_engagement', {
      engagement_action: action,
      engagement_element: element,
      engagement_value: value || 0,
      category: 'engagement',
      label: `${action}_${element}`,
    });
  }

  // Track e-commerce events (for future use)
  trackPurchase(transactionId: string, value: number, currency: string, items: any[]) {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
      category: 'ecommerce',
    });
  }

  // Track search events
  trackSearch(searchTerm: string, resultsCount: number) {
    this.trackEvent('search', {
      search_term: searchTerm,
      search_results: resultsCount,
      category: 'search',
      label: searchTerm,
    });
  }

  // Track video events
  trackVideoPlay(videoTitle: string, videoDuration: number) {
    this.trackEvent('video_play', {
      video_title: videoTitle,
      video_duration: videoDuration,
      category: 'video',
      label: videoTitle,
    });
  }

  // Track file downloads
  trackDownload(fileName: string, fileType: string) {
    this.trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
      category: 'download',
      label: fileName,
    });
  }

  // Track social media clicks
  trackSocialClick(platform: string, action: string) {
    this.trackEvent('social_click', {
      social_platform: platform,
      social_action: action,
      category: 'social',
      label: `${platform}_${action}`,
    });
  }

  // Track errors
  trackError(errorMessage: string, errorType: string, errorLocation: string) {
    this.trackEvent('error', {
      error_message: errorMessage,
      error_type: errorType,
      error_location: errorLocation,
      category: 'error',
      label: errorType,
    });
  }

  // Get analytics data (for debugging)
  getAnalyticsData() {
    return {
      consentGiven: this.consentGiven,
      pendingEvents: this.pendingEvents.length,
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
    };
  }
}

// React hook for analytics
export function useAnalytics() {
  useEffect(() => {
    const analytics = AnalyticsManager.getInstance();
    analytics.initialize();
  }, []);

  return AnalyticsManager.getInstance();
}

// Component for tracking page views
export function AnalyticsPageTracker({ 
  path, 
  title, 
  category 
}: { 
  path: string; 
  title: string; 
  category?: string; 
}) {
  const analytics = AnalyticsManager.getInstance();

  useEffect(() => {
    analytics.trackPageView(path, title, category);
  }, [path, title, category, analytics]);

  return null;
}

// Component for tracking form submissions
export function AnalyticsFormTracker({ 
  formName, 
  onSubmit, 
  onSuccess, 
  onError 
}: { 
  formName: string;
  onSubmit?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const analytics = AnalyticsManager.getInstance();

  const handleSubmit = () => {
    analytics.trackEvent('form_submit_attempt', {
      form_name: formName,
      category: 'form',
      label: `${formName}_attempt`,
    });
    onSubmit?.();
  };

  const handleSuccess = () => {
    analytics.trackFormSubmission(formName, true);
    onSuccess?.();
  };

  const handleError = (error: string) => {
    analytics.trackFormSubmission(formName, false, error);
    onError?.(error);
  };

  return { handleSubmit, handleSuccess, handleError };
}

// Component for tracking CTA clicks
export function AnalyticsCTATracker({ 
  text, 
  location, 
  destination, 
  onClick 
}: { 
  text: string;
  location: string;
  destination: string;
  onClick?: () => void;
}) {
  const analytics = AnalyticsManager.getInstance();

  const handleClick = () => {
    analytics.trackCTAClick(text, location, destination);
    onClick?.();
  };

  return handleClick;
}

export default AnalyticsManager;
