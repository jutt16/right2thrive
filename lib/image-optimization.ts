// Image optimization utilities for Next.js
// This file provides utilities for generating optimized image formats

export interface ImageOptimizationOptions {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes: string;
  srcSet: string;
  width: number;
  height: number;
  quality?: number;
}

// Generate responsive image configuration
export function generateResponsiveImage({
  src,
  alt,
  widths = [640, 750, 828, 1080, 1200, 1920],
  sizes = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  quality = 90,
  aspectRatio = 16 / 9
}: {
  src: string;
  alt: string;
  widths?: number[];
  sizes?: string;
  quality?: number;
  aspectRatio?: number;
}): ResponsiveImageConfig {
  const srcSet = widths
    .map((width) => {
      const height = Math.round(width / aspectRatio);
      return `${src}?w=${width}&h=${height}&q=${quality}&f=webp ${width}w`;
    })
    .join(", ");

  return {
    src: `${src}?w=${widths[0]}&q=${quality}&f=webp`,
    alt,
    sizes,
    srcSet,
    width: widths[0],
    height: Math.round(widths[0] / aspectRatio),
    quality,
  };
}

// Generate multiple format srcsets for modern browsers
export function generateMultiFormatSrcSet({
  src,
  widths = [640, 750, 828, 1080, 1200, 1920],
  quality = 90,
  aspectRatio = 16 / 9
}: {
  src: string;
  widths?: number[];
  quality?: number;
  aspectRatio?: number;
}) {
  const formats = ['avif', 'webp', 'jpeg'] as const;
  
  return formats.map(format => {
    const srcSet = widths
      .map((width) => {
        const height = Math.round(width / aspectRatio);
        return `${src}?w=${width}&h=${height}&q=${quality}&f=${format} ${width}w`;
      })
      .join(", ");
    
    return {
      format,
      srcSet,
      type: `image/${format}`,
    };
  });
}

// Generate optimized image URL with Next.js Image Optimization API
export function getOptimizedImageUrl({
  src,
  width,
  height,
  quality = 90,
  format = 'webp'
}: ImageOptimizationOptions): string {
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  params.set('f', format);
  
  return `${src}?${params.toString()}`;
}

// Generate blur placeholder for images
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient blur
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

// Preload critical images
export function preloadImage(src: string, as: 'image' = 'image') {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

// Generate image dimensions for different breakpoints
export const BREAKPOINT_IMAGES = {
  mobile: { width: 640, height: 360 },
  tablet: { width: 768, height: 432 },
  desktop: { width: 1024, height: 576 },
  large: { width: 1920, height: 1080 },
} as const;

// Generate responsive image configuration for different use cases
export const IMAGE_CONFIGS = {
  hero: {
    widths: [640, 750, 828, 1080, 1200, 1920],
    sizes: "100vw",
    quality: 95,
    priority: true,
  },
  card: {
    widths: [300, 400, 500, 600],
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw",
    quality: 85,
    priority: false,
  },
  thumbnail: {
    widths: [150, 200, 250, 300],
    sizes: "(max-width: 640px) 50vw, (max-width: 768px) 25vw, 20vw",
    quality: 80,
    priority: false,
  },
  avatar: {
    widths: [48, 64, 80, 96],
    sizes: "48px",
    quality: 90,
    priority: false,
  },
} as const;

// CDN URL configuration
export const CDN_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_CDN_URL || '',
  imagePath: '/images',
  formats: ['avif', 'webp', 'jpeg'] as const,
  qualities: [75, 85, 95] as const,
};

// Generate CDN image URL
export function getCDNImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'avif' | 'webp' | 'jpeg';
  } = {}
): string {
  if (!CDN_CONFIG.baseUrl) return src;
  
  const { width, height, quality = 85, format = 'webp' } = options;
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  params.set('f', format);
  
  const cleanSrc = src.replace(/^\//, ''); // Remove leading slash
  return `${CDN_CONFIG.baseUrl}${CDN_CONFIG.imagePath}/${cleanSrc}?${params.toString()}`;
}

export default {
  generateResponsiveImage,
  generateMultiFormatSrcSet,
  getOptimizedImageUrl,
  generateBlurDataURL,
  preloadImage,
  BREAKPOINT_IMAGES,
  IMAGE_CONFIGS,
  CDN_CONFIG,
  getCDNImageUrl,
};
