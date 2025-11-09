"use client";

import { useEffect } from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure Core Web Vitals
  measureWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
      this.trackEvent('web_vitals', 'LCP', Math.round(lastEntry.startTime));
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const e = entry as PerformanceEventTiming;
        const fid = e.processingStart - e.startTime;
        this.metrics.set('FID', fid);
        this.trackEvent('web_vitals', 'FID', Math.round(fid));
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.metrics.set('CLS', clsValue);
      this.trackEvent('web_vitals', 'CLS', Math.round(clsValue * 1000));
    }).observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.metrics.set('FCP', entry.startTime);
        this.trackEvent('web_vitals', 'FCP', Math.round(entry.startTime));
      });
    }).observe({ entryTypes: ['paint'] });
  }

  // Track custom events
  trackEvent(category: string, action: string, value?: number, label?: string) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        custom_parameter_1: window.location.pathname,
        custom_parameter_2: navigator.userAgent,
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { category, action, value, label });
    }
  }

  // Track page views
  trackPageView(path: string, title: string) {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: path,
        page_title: title,
      });
    }
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, errorMessage?: string) {
    this.trackEvent('form', success ? 'submit_success' : 'submit_error', undefined, formName);
    
    if (errorMessage) {
      this.trackEvent('error', 'form_error', undefined, errorMessage);
    }
  }

  // Track CTA clicks
  trackCTAClick(ctaText: string, location: string, destination: string) {
    this.trackEvent('cta', 'click', undefined, `${ctaText} - ${location}`);
    this.trackEvent('navigation', 'cta_click', undefined, destination);
  }

  // Track user engagement
  trackEngagement(action: string, element: string, value?: number) {
    this.trackEvent('engagement', action, value, element);
  }

  // Get performance metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.measureWebVitals();

    // Track page load time
    const loadTime = performance.now();
    monitor.trackEvent('performance', 'page_load', Math.round(loadTime));

    // Track user interactions
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        monitor.trackEngagement('click', target.textContent || 'unknown');
      }
    };

    document.addEventListener('click', trackInteraction);
    
    return () => {
      document.removeEventListener('click', trackInteraction);
    };
  }, []);
}

// Component for tracking page views
export function PageViewTracker({ path, title }: { path: string; title: string }) {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.trackPageView(path, title);
  }, [path, title]);

  return null;
}

// Component for tracking form submissions
export function FormTracker({ 
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
  const monitor = PerformanceMonitor.getInstance();

  const handleSubmit = () => {
    monitor.trackEvent('form', 'submit_attempt', undefined, formName);
    onSubmit?.();
  };

  const handleSuccess = () => {
    monitor.trackFormSubmission(formName, true);
    onSuccess?.();
  };

  const handleError = (error: string) => {
    monitor.trackFormSubmission(formName, false, error);
    onError?.(error);
  };

  return { handleSubmit, handleSuccess, handleError };
}

// Component for tracking CTA clicks
export function CTATracker({ 
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
  const monitor = PerformanceMonitor.getInstance();

  const handleClick = () => {
    monitor.trackCTAClick(text, location, destination);
    onClick?.();
  };

  return handleClick;
}

export default PerformanceMonitor;
