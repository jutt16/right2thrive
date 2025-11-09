"use client";

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Import web-vitals library dynamically (cast to any to satisfy TS types)
    import('web-vitals').then((wv: any) => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = wv;
      // Core Web Vitals
  getCLS((metric: any) => {
        console.log('CLS:', metric);
        // Send to analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'CLS',
            metric_value: Math.round(metric.value * 1000),
            metric_delta: Math.round(metric.delta * 1000),
          });
        }
      });

  getFID((metric: any) => {
        console.log('FID:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'FID',
            metric_value: Math.round(metric.value),
            metric_delta: Math.round(metric.delta),
          });
        }
      });

  getLCP((metric: any) => {
        console.log('LCP:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'LCP',
            metric_value: Math.round(metric.value),
            metric_delta: Math.round(metric.delta),
          });
        }
      });

      // Additional metrics
  getFCP((metric: any) => {
        console.log('FCP:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'FCP',
            metric_value: Math.round(metric.value),
            metric_delta: Math.round(metric.delta),
          });
        }
      });

  getTTFB((metric: any) => {
        console.log('TTFB:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'TTFB',
            metric_value: Math.round(metric.value),
            metric_delta: Math.round(metric.delta),
          });
        }
      });
    });

    // Monitor image loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && entry.name.includes('_next/image')) {
          console.log('Image loaded:', entry.name, entry.duration);
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'image_load', {
              image_url: entry.name,
              load_time: Math.round(entry.duration),
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry: any = entries[entries.length - 1];

      console.log('LCP Element:', lastEntry.element);

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'lcp_element', {
          element_tag: lastEntry.element?.tagName || 'unknown',
          element_src: lastEntry.element?.src || 'unknown',
        });
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
    };
  }, []);

  return null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
