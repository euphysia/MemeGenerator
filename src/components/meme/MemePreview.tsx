import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { processMemeText, calculateFontSize } from '@/lib/utils';

interface MemePreviewProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const MemePreview: React.FC<MemePreviewProps> = ({
  imageUrl,
  topText,
  bottomText,
  className,
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Process text for display
  const processedTopText = processMemeText(topText);
  const processedBottomText = processMemeText(bottomText);

  // Calculate font size for preview
  const getPreviewFontSize = useCallback((containerWidth: number, text: string): number => {
    const baseSize = Math.max(containerWidth * 0.03, 12); // Minimum 12px
    const maxSize = Math.min(containerWidth * 0.06, 48); // Maximum 48px
    
    // Reduce font size for longer text
    const lengthFactor = Math.max(0.6, 1 - (text.length - 8) * 0.03);
    const calculatedSize = baseSize * lengthFactor;
    
    return Math.min(calculatedSize, maxSize);
  }, []);

  // Handle image load
  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
    setImageError(null);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleImageError = useCallback(() => {
    const errorMessage = 'Failed to load image';
    setImageError(errorMessage);
    setImageLoaded(false);
    onError?.(errorMessage);
  }, [onError]);

  // Reset state when image URL changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(null);
    setImageDimensions(null);
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Preview</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No image selected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Live Preview</h3>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Image Container */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Loading image...</p>
                </div>
              </div>
            )}
            
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
                <div className="text-center">
                  <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{imageError}</p>
                </div>
              </div>
            )}
            
            {/* Image */}
            <img
              src={imageUrl}
              alt="Meme preview"
              className="w-full h-auto max-w-full block"
              style={{ maxHeight: '400px' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
            
            {/* Text Overlays */}
            {imageLoaded && (
              <>
                {/* Top Text */}
                {processedTopText && (
                  <div 
                    className="absolute top-2 left-2 right-2 text-center"
                    style={{
                      fontSize: `${getPreviewFontSize(400, processedTopText)}px`,
                      lineHeight: '1.2'
                    }}
                  >
                    <div 
                      className="inline-block px-2 py-1"
                      style={{
                        textShadow: `
                          -1px -1px 0 #000,
                          1px -1px 0 #000,
                          -1px 1px 0 #000,
                          1px 1px 0 #000,
                          2px 2px 4px rgba(0,0,0,0.8)
                        `,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        fontWeight: 'bold',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {processedTopText}
                    </div>
                  </div>
                )}
                
                {/* Bottom Text */}
                {processedBottomText && (
                  <div 
                    className="absolute bottom-2 left-2 right-2 text-center"
                    style={{
                      fontSize: `${getPreviewFontSize(400, processedBottomText)}px`,
                      lineHeight: '1.2'
                    }}
                  >
                    <div 
                      className="inline-block px-2 py-1"
                      style={{
                        textShadow: `
                          -1px -1px 0 #000,
                          1px -1px 0 #000,
                          -1px 1px 0 #000,
                          1px 1px 0 #000,
                          2px 2px 4px rgba(0,0,0,0.8)
                        `,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        fontWeight: 'bold',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {processedBottomText}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Image Info */}
          {imageDimensions && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Original: {imageDimensions.width} × {imageDimensions.height}px
            </div>
          )}
          
          {/* Text Preview Info */}
          {(processedTopText || processedBottomText) && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
              <div className="font-medium mb-1">Text Preview:</div>
              {processedTopText && (
                <div className="mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Top:</span> {processedTopText}
                </div>
              )}
              {processedBottomText && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Bottom:</span> {processedBottomText}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 