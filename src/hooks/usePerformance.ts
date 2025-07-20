import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  loadTime: number | null; // Total page load time
  domContentLoaded: number | null; // DOM Content Loaded time
}

interface PerformanceObserver {
  observe: (options: any) => void;
  disconnect: () => void;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null
  });

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Performance API is supported
    if (!('performance' in window) || !('PerformanceObserver' in window)) {
      console.warn('Performance API not supported');
      return;
    }

    setIsSupported(true);

    // Get navigation timing data
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart
      }));
    }

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('FCP observer failed:', error);
      }
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observer failed:', error);
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              setMetrics(prev => ({ ...prev, fid }));
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observer failed:', error);
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const clsObserver = new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              setMetrics(prev => ({ ...prev, cls: clsValue }));
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observer failed:', error);
      }
    }

    // Cleanup observers on unmount
    return () => {
      // Observers will be automatically cleaned up when the component unmounts
    };
  }, []);

  const getPerformanceScore = useCallback(() => {
    if (!isSupported) return null;

    let score = 100;
    const issues: string[] = [];

    // FCP scoring (0-100)
    if (metrics.fcp !== null) {
      if (metrics.fcp > 2500) {
        score -= 20;
        issues.push('Slow First Contentful Paint');
      } else if (metrics.fcp > 1800) {
        score -= 10;
        issues.push('Moderate First Contentful Paint');
      }
    }

    // LCP scoring (0-100)
    if (metrics.lcp !== null) {
      if (metrics.lcp > 4000) {
        score -= 25;
        issues.push('Slow Largest Contentful Paint');
      } else if (metrics.lcp > 2500) {
        score -= 15;
        issues.push('Moderate Largest Contentful Paint');
      }
    }

    // FID scoring (0-100)
    if (metrics.fid !== null) {
      if (metrics.fid > 300) {
        score -= 25;
        issues.push('Slow First Input Delay');
      } else if (metrics.fid > 100) {
        score -= 15;
        issues.push('Moderate First Input Delay');
      }
    }

    // CLS scoring (0-100)
    if (metrics.cls !== null) {
      if (metrics.cls > 0.25) {
        score -= 30;
        issues.push('Poor Cumulative Layout Shift');
      } else if (metrics.cls > 0.1) {
        score -= 20;
        issues.push('Moderate Cumulative Layout Shift');
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
    };
  }, [metrics, isSupported]);

  const logPerformanceMetrics = useCallback(() => {
    if (!isSupported) {
      console.log('Performance monitoring not supported');
      return;
    }

    const score = getPerformanceScore();
    console.group('🚀 Performance Metrics');
    console.log('FCP (First Contentful Paint):', metrics.fcp?.toFixed(2), 'ms');
    console.log('LCP (Largest Contentful Paint):', metrics.lcp?.toFixed(2), 'ms');
    console.log('FID (First Input Delay):', metrics.fid?.toFixed(2), 'ms');
    console.log('CLS (Cumulative Layout Shift):', metrics.cls?.toFixed(3));
    console.log('TTFB (Time to First Byte):', metrics.ttfb?.toFixed(2), 'ms');
    console.log('Load Time:', metrics.loadTime?.toFixed(2), 'ms');
    console.log('DOM Content Loaded:', metrics.domContentLoaded?.toFixed(2), 'ms');
    
    if (score) {
      console.log('Performance Score:', score.score, '/ 100 (Grade:', score.grade + ')');
      if (score.issues.length > 0) {
        console.warn('Issues found:', score.issues);
      }
    }
    console.groupEnd();
  }, [metrics, isSupported, getPerformanceScore]);

  const measureAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    name: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  return {
    metrics,
    isSupported,
    getPerformanceScore,
    logPerformanceMetrics,
    measureAsyncOperation
  };
}; 