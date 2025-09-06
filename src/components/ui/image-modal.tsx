
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Fullscreen, Info } from 'lucide-react';
import { Button } from './button';
import { FallbackImage } from './fallback-image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    src: string;
    alt: string;
    hint?: string;
  }>;
  initialIndex?: number;
}

export function ImageModal({ isOpen, onClose, images, initialIndex = 0 }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsFullscreen(false);
      setShowInfo(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // Keyboard event handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetView();
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetView();
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.2, 0.1));
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const downloadImage = useCallback(async () => {
    try {
      const currentImage = images[currentIndex];
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dance-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [images, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetView();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          downloadImage();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setShowInfo(!showInfo);
          break;
        case ' ':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, scale, rotation, showInfo, downloadImage, goToNext, goToPrevious, resetView, toggleFullscreen, zoomIn, zoomOut]);

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen) return;
      e.preventDefault();
      
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };

    if (isOpen) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, zoomIn, zoomOut]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
      // Don't set isDragging immediately to allow for double tap detection
    }
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > 1) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - (dragStart.x + position.x));
      const deltaY = Math.abs(touch.clientY - (dragStart.y + position.y));
      
      // Start dragging if movement exceeds threshold
      if (deltaX > 5 || deltaY > 5) {
        setIsDragging(true);
        e.preventDefault();
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        });
      }
    }
  }, [scale, dragStart, position]);



  // Double tap to zoom
  const handleDoubleClick = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTouchTime.current;
    
    if (timeDiff < 300) { // Double tap threshold
      if (scale > 1) {
        resetView();
      } else {
        setScale(2);
      }
    }
    
    lastTouchTime.current = now;
  }, [scale, resetView]);

  // Touch double tap handler for mobile
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTouchTime.current;
    
    // Only trigger double tap if we haven't been dragging
    if (timeDiff < 300 && e.touches.length === 0 && !isDragging) {
      if (scale > 1) {
        resetView();
      } else {
        setScale(2);
      }
    }
    
    lastTouchTime.current = now;
    setIsDragging(false);
  }, [scale, resetView, isDragging]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 text-white hover:bg-black/70 border border-white/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10"
        aria-label="Close image viewer"
      >
        <X className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 border border-white/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 border border-white/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </>
      )}

      {/* Image container */}
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-8">
        <div 
          ref={imageRef}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                maxWidth: 'calc(100vw - 4rem)',
                maxHeight: 'calc(100vh - 12rem)',
                width: 'auto',
                height: 'auto',
                display: 'block',
              }}
              onError={(e) => {
                console.log('Image failed to load:', currentImage.src);
                // Fallback to a local image if the current one fails
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/images/')) {
                  target.src = '/images/1.jpg';
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-1 sm:p-2 border border-white/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          className="text-white hover:bg-white/20"
          disabled={scale <= 0.1}
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="text-white hover:bg-white/20 text-xs px-2"
          title="Reset View (R)"
          aria-label="Reset view"
        >
          {Math.round(scale * 100)}%
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          className="text-white hover:bg-white/20"
          disabled={scale >= 5}
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={rotate}
          className="text-white hover:bg-white/20"
          title="Rotate (R)"
          aria-label="Rotate image"
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/20"
          title="Fullscreen (F)"
          aria-label="Toggle fullscreen"
        >
          <Fullscreen className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={downloadImage}
          className="text-white hover:bg-white/20"
          title="Download (D)"
          aria-label="Download image"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
          className={`text-white hover:bg-white/20 ${showInfo ? 'bg-white/20' : ''}`}
          title="Toggle Info (I)"
          aria-label="Toggle image information"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Image info */}
      {showInfo && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 max-w-xs sm:max-w-md">
          <p className="text-white font-medium text-xs sm:text-sm mb-1">
            {currentImage.alt}
          </p>
          {currentImage.hint && (
            <p className="text-white/70 text-xs">
              {currentImage.hint}
            </p>
          )}
          <p className="text-white/50 text-xs mt-1 sm:mt-2">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm rounded-lg p-1 sm:p-2 border border-white/20 max-w-[200px] sm:max-w-xs">
        <p className="text-white/70 text-xs">
          <span className="block">← → Navigate</span>
          <span className="block">+ - Zoom</span>
          <span className="block">R Rotate/Reset</span>
          <span className="block">F Fullscreen</span>
          <span className="block">D Download</span>
          <span className="block">I Info</span>
          <span className="block">ESC Close</span>
          <span className="block mt-1">Double-click to zoom</span>
        </p>
      </div>
    </div>
  );
} 
