'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  onLoad?: () => void;
  fallback?: ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  onLoad,
  fallback
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsLoading(false);
          onLoad?.();
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, onLoad]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  if (!isVisible) {
    return (
      <div ref={ref} className={className}>
        {placeholder || (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onError: handleError,
            onLoad: () => setIsLoading(false)
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError,
  width,
  height
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src && src !== placeholder) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };
      img.src = src;
    }
  }, [src, placeholder, onLoad, onError]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 dark:text-gray-500 text-sm">Failed to load image</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};

interface LazyComponentProps {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  placeholder?: ReactNode;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  component: Component,
  props = {},
  placeholder,
  className = ''
}) => {
  return (
    <LazyLoad placeholder={placeholder} className={className}>
      <Component {...props} />
    </LazyLoad>
  );
};

export default LazyLoad; 