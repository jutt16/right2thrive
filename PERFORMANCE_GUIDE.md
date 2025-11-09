# Performance Optimization Guide

## Overview
This document outlines the performance optimizations implemented in the Right2Thrive UK frontend application to improve Core Web Vitals and overall user experience.

## Implemented Optimizations

### 1. Image Optimization
- **Next.js Image Component**: All images now use the optimized Next.js Image component
- **Responsive Images**: Implemented responsive srcset with proper device sizes
- **Modern Formats**: Configured WebP and AVIF format support
- **Lazy Loading**: Below-the-fold images load lazily to improve initial page load
- **Blur Placeholders**: Added blur placeholders for better perceived performance
- **Priority Loading**: Critical images (hero, logos) load with priority

### 2. Caching Strategy
- **Static Assets**: 1-year cache for static assets with immutable flag
- **Images**: 1-year cache for optimized images
- **API Routes**: 5-minute cache for API responses
- **Security Headers**: Added security headers for better performance and security

### 3. Bundle Optimization
- **Code Splitting**: Automatic code splitting for better loading performance
- **Tree Shaking**: Removed unused code from bundles
- **Package Optimization**: Optimized imports for lucide-react and react-icons
- **CSS Optimization**: Enabled CSS optimization

### 4. Performance Monitoring
- **Core Web Vitals**: Tracking CLS, FID, LCP, FCP, and TTFB
- **Image Load Times**: Monitoring image loading performance
- **LCP Elements**: Tracking largest contentful paint elements
- **Google Analytics**: Integration with Google Analytics for performance metrics

## Performance Metrics

### Target Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Image Optimization Settings
- **Quality**: 85% (balanced quality/size)
- **Formats**: WebP, AVIF (with JPEG fallback)
- **Device Sizes**: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
- **Image Sizes**: [16, 32, 48, 64, 96, 128, 256, 384]

## Usage Examples

### Optimized Image Component
```tsx
import Image from 'next/image';
import { getOptimizedImageProps } from '@/lib/image-utils';

// Hero image (priority loading)
<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority={true}
  quality={90}
  sizes="100vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Card image (lazy loading)
<Image
  src="/card-image.jpg"
  alt="Card image"
  width={400}
  height={300}
  priority={false}
  loading="lazy"
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Using Image Utils
```tsx
import { getOptimizedImageProps } from '@/lib/image-utils';

const imageProps = getOptimizedImageProps(
  '/image.jpg',
  'Alt text',
  400,
  300,
  'card', // preset
  'rounded-lg'
);

<Image {...imageProps} />
```

## Monitoring and Analytics

### Core Web Vitals Tracking
The application automatically tracks Core Web Vitals and sends them to Google Analytics:

- **CLS**: Cumulative Layout Shift
- **FID**: First Input Delay  
- **LCP**: Largest Contentful Paint
- **FCP**: First Contentful Paint
- **TTFB**: Time to First Byte

### Performance Events
- `web_vitals`: Core Web Vitals metrics
- `image_load`: Image loading performance
- `lcp_element`: Largest contentful paint element details

## Best Practices

### Image Optimization
1. Always use Next.js Image component
2. Provide proper alt text for accessibility
3. Use appropriate quality settings (85% for most images)
4. Implement lazy loading for below-the-fold images
5. Use blur placeholders for better UX

### Performance
1. Prioritize critical images (hero, logos)
2. Use responsive images with proper sizes
3. Implement proper caching headers
4. Monitor Core Web Vitals regularly
5. Optimize bundle size with code splitting

### Mobile Optimization
1. Use appropriate device sizes for responsive images
2. Optimize for mobile-first approach
3. Consider mobile data usage
4. Test on real devices and slow connections

## Tools and Resources

### Performance Testing
- Google PageSpeed Insights
- WebPageTest
- Chrome DevTools Lighthouse
- Core Web Vitals Chrome Extension

### Monitoring
- Google Analytics Core Web Vitals
- Google Search Console
- Custom performance monitoring component

## Future Improvements

### Planned Optimizations
1. **Service Worker**: Implement service worker for offline functionality
2. **CDN Integration**: Set up CDN for static assets
3. **Image CDN**: Consider using image CDN for further optimization
4. **Preloading**: Implement strategic preloading for critical resources
5. **Bundle Analysis**: Regular bundle analysis to identify optimization opportunities

### Performance Budget
- **JavaScript Bundle**: < 250KB gzipped
- **CSS Bundle**: < 50KB gzipped
- **Images**: < 1MB total per page
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## Troubleshooting

### Common Issues
1. **Images not loading**: Check Next.js image optimization configuration
2. **Poor LCP**: Ensure hero images have priority loading
3. **High CLS**: Use proper image dimensions and blur placeholders
4. **Slow FID**: Optimize JavaScript bundle size

### Debug Tools
- Chrome DevTools Performance tab
- Network tab for image loading analysis
- Lighthouse audits
- Core Web Vitals reports in Google Analytics
