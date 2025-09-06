
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { getFallbackUrls, getPlaceholderImage } from '@/lib/image-utils';

interface FallbackImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  'data-ai-hint'?: string;
}

export function FallbackImage({
  src,
  alt,
  width = 600,
  height = 400,
  className = '',
  priority = false,
  onLoad,
  onError,
  style,
  ...props
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(!src);
  const [retryCount, setRetryCount] = useState(0);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(!src);
    setRetryCount(0);
  }, [src]);

  const handleError = useCallback(() => {
    if (retryCount < 2) {
      // Retry with a query param to break cache
      setCurrentSrc(`${src}?retry=${retryCount + 1}`);
      setRetryCount(prev => prev + 1);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [src, retryCount, onError]);

  const handleLoad = useCallback(() => {
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setCurrentSrc(`${src}?retry=${retryCount + 1}`);
    }
  }, [retryCount, src]);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg ${className}`}
        style={{ width: width, height: height, ...style }}
        {...props}
      >
        <div className="text-center p-4">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Image unavailable</p>
          {retryCount < 3 && src && (
            <button
              onClick={handleRetry}
              className="text-xs text-primary hover:text-primary/80 underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Ensure we never pass an empty or invalid string to the Image component
  const safeSrc = currentSrc || getPlaceholderImage(width, height);

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      onLoad={handleLoad}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      style={style}
      {...props}
    />
  );
}
