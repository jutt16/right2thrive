import { ImageProps } from 'next/image';

// Base64 encoded 1x1 transparent pixel for blur placeholder
export const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

// Responsive image sizes for different use cases
export const IMAGE_SIZES = {
  hero: '100vw',
  card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  thumbnail: '(max-width: 768px) 50vw, 25vw',
  logo: '(max-width: 768px) 50px, 100px',
  fullWidth: '100vw',
} as const;

// Image optimization presets
export const IMAGE_PRESETS = {
  hero: {
    priority: true,
    quality: 90,
    sizes: IMAGE_SIZES.hero,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_DATA_URL,
  },
  card: {
    priority: false,
    quality: 85,
    sizes: IMAGE_SIZES.card,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_DATA_URL,
    loading: 'lazy' as const,
  },
  thumbnail: {
    priority: false,
    quality: 80,
    sizes: IMAGE_SIZES.thumbnail,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_DATA_URL,
    loading: 'lazy' as const,
  },
  logo: {
    priority: true,
    quality: 90,
    sizes: IMAGE_SIZES.logo,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_DATA_URL,
  },
} as const;

// Utility function to get optimized image props
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width: number,
  height: number,
  preset: keyof typeof IMAGE_PRESETS = 'card',
  className?: string
): Partial<ImageProps> {
  return {
    src,
    alt,
    width,
    height,
    className,
    ...IMAGE_PRESETS[preset],
  };
}

// Utility function for responsive image sizes
export function getResponsiveSizes(breakpoints: Record<string, number>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}px) ${size}vw`)
    .join(', ') + ', 100vw';
}

// Preload critical images
export function preloadImage(src: string, as: 'image' = 'image') {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = as;
    document.head.appendChild(link);
  }
}

// Generate WebP src for fallback
export function getWebPSrc(src: string): string {
  if (src.endsWith('.jpg') || src.endsWith('.jpeg')) {
    return src.replace(/\.(jpg|jpeg)$/i, '.webp');
  }
  return src;
}

// Check if browser supports WebP
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}
