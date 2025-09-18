// Responsive utilities for handling different screen sizes and device types

import { writable } from 'svelte/store';

// Breakpoints (matching Tailwind CSS defaults)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Device type detection
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchSupported: boolean;
  userAgent: string;
}

// Reactive store for device information
export const deviceInfo = writable<DeviceInfo>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenWidth: 1024,
  screenHeight: 768,
  orientation: 'landscape',
  touchSupported: false,
  userAgent: ''
});

// Initialize device detection
export function initDeviceDetection() {
  if (typeof window === 'undefined') return;
  
  function updateDeviceInfo() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < breakpoints.md;
    const isTablet = width >= breakpoints.md && width < breakpoints.lg;
    const isDesktop = width >= breakpoints.lg;
    const orientation = width > height ? 'landscape' : 'portrait';
    const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    deviceInfo.set({
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: height,
      orientation,
      touchSupported,
      userAgent: navigator.userAgent
    });
  }
  
  // Initial detection
  updateDeviceInfo();
  
  // Listen for resize events
  window.addEventListener('resize', updateDeviceInfo);
  window.addEventListener('orientationchange', updateDeviceInfo);
  
  return () => {
    window.removeEventListener('resize', updateDeviceInfo);
    window.removeEventListener('orientationchange', updateDeviceInfo);
  };
}

// Media query helpers
export function createMediaQuery(query: string) {
  if (typeof window === 'undefined') {
    return writable(false);
  }
  
  const mediaQuery = window.matchMedia(query);
  const store = writable(mediaQuery.matches);
  
  const handler = (e: MediaQueryListEvent) => {
    store.set(e.matches);
  };
  
  mediaQuery.addEventListener('change', handler);
  
  return {
    subscribe: store.subscribe,
    destroy: () => mediaQuery.removeEventListener('change', handler)
  };
}

// Predefined media queries
export const isMobile = createMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
export const isTablet = createMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
export const isDesktop = createMediaQuery(`(min-width: ${breakpoints.lg}px)`);
export const isLargeScreen = createMediaQuery(`(min-width: ${breakpoints.xl}px)`);
export const prefersReducedMotion = createMediaQuery('(prefers-reduced-motion: reduce)');
export const prefersDarkMode = createMediaQuery('(prefers-color-scheme: dark)');
export const isPortrait = createMediaQuery('(orientation: portrait)');
export const isLandscape = createMediaQuery('(orientation: landscape)');

// Responsive text sizing
export function getResponsiveTextSize(baseSize: string, mobileSize?: string, tabletSize?: string) {
  if (typeof window === 'undefined') return baseSize;
  
  const width = window.innerWidth;
  
  if (width < breakpoints.md && mobileSize) {
    return mobileSize;
  } else if (width < breakpoints.lg && tabletSize) {
    return tabletSize;
  }
  
  return baseSize;
}

// Responsive spacing
export function getResponsiveSpacing(desktop: string, tablet?: string, mobile?: string) {
  if (typeof window === 'undefined') return desktop;
  
  const width = window.innerWidth;
  
  if (width < breakpoints.md && mobile) {
    return mobile;
  } else if (width < breakpoints.lg && tablet) {
    return tablet;
  }
  
  return desktop;
}

// Grid columns helper
export function getResponsiveColumns(desktop: number, tablet?: number, mobile?: number) {
  if (typeof window === 'undefined') return desktop;
  
  const width = window.innerWidth;
  
  if (width < breakpoints.md && mobile !== undefined) {
    return mobile;
  } else if (width < breakpoints.lg && tablet !== undefined) {
    return tablet;
  }
  
  return desktop;
}

// Touch gesture detection
export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  duration: number;
}

export function createTouchGestureHandler(
  element: HTMLElement,
  onGesture: (gesture: TouchGesture) => void,
  threshold = 50
) {
  let startTime: number;
  let startTouch: Touch | null = null;
  
  function handleTouchStart(e: TouchEvent) {
    startTime = Date.now();
    startTouch = e.touches[0];
  }
  
  function handleTouchEnd(e: TouchEvent) {
    if (!startTouch) return;
    
    const endTouch = e.changedTouches[0];
    const deltaX = endTouch.clientX - startTouch.clientX;
    const deltaY = endTouch.clientY - startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - startTime;
    
    let direction: TouchGesture['direction'] = null;
    
    if (distance > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }
    
    const gesture: TouchGesture = {
      startX: startTouch.clientX,
      startY: startTouch.clientY,
      endX: endTouch.clientX,
      endY: endTouch.clientY,
      deltaX,
      deltaY,
      direction,
      distance,
      duration
    };
    
    onGesture(gesture);
    startTouch = null;
  }
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

// Viewport utilities
export function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function isElementInViewport(element: HTMLElement, threshold = 0) {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

// Scroll utilities
export function getScrollPosition() {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 };
  }
  
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

export function scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  if (typeof window === 'undefined') return;
  
  element.scrollIntoView({ behavior, block: 'start' });
}

// Performance utilities for mobile
export function shouldUseReducedAnimations() {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

export function shouldUseLowQualityImages() {
  if (typeof window === 'undefined') return false;
  
  // Check for slow connection
  const connection = (navigator as any).connection;
  if (connection) {
    return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  }
  
  return false;
}

// Responsive image loading
export function getResponsiveImageSrc(
  baseSrc: string,
  sizes: { mobile?: string; tablet?: string; desktop?: string } = {}
) {
  if (typeof window === 'undefined') return baseSrc;
  
  const width = window.innerWidth;
  
  if (width < breakpoints.md && sizes.mobile) {
    return sizes.mobile;
  } else if (width < breakpoints.lg && sizes.tablet) {
    return sizes.tablet;
  } else if (sizes.desktop) {
    return sizes.desktop;
  }
  
  return baseSrc;
}

// Safe area utilities (for mobile devices with notches)
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
  };
}