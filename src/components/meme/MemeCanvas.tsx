import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import { 
  generateMemeCanvas, 
  downloadMeme, 
  canvasToDataURL,
  validateImageForMeme 
} from '@/lib/utils';

interface MemeCanvasProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageUrl,
  topText,
  bottomText,
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate meme canvas
  const generateCanvas = useCallback(async () => {
    if (!imageUrl) return;

    setIsGenerating(true);
    setError(null);

    try {
      const canvas = await generateMemeCanvas(imageUrl, topText, bottomText, {
        width,
        height,
        quality: 0.9
      });

      // Update the canvas ref
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
          ctx.drawImage(canvas, 0, 0);
        }
      }

      // Generate preview URL
      const dataUrl = canvasToDataURL(canvas);
      setPreviewUrl(dataUrl);

      setIsReady(true);
      onCanvasReady?.(canvas);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate meme';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [imageUrl, topText, bottomText, width, height, onCanvasReady, onError]);

  // Regenerate canvas when props change
  useEffect(() => {
    generateCanvas();
  }, [generateCanvas]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `meme-${timestamp}.png`;
    
    try {
      downloadMeme(canvasRef.current, filename);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download meme';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  // Handle copy to clipboard
  const handleCopyToClipboard = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current!.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png', 0.9);
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Meme Preview</h3>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          {/* Canvas Container */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Generating meme...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
                <div className="text-center">
                  <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}
            
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full h-auto max-w-full block"
              style={{ maxHeight: '600px' }}
            />
            
            {/* Fallback Preview */}
            {!isGenerating && !error && previewUrl && (
              <img
                src={previewUrl}
                alt="Meme preview"
                className="w-full h-auto max-w-full block"
                style={{ maxHeight: '600px' }}
              />
            )}
          </div>
          
          {/* Canvas Info */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Canvas: {width} × {height}px
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            disabled={!isReady || isGenerating}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            Download
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCopyToClipboard}
            disabled={!isReady || isGenerating}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
          >
            Copy
          </Button>
        </div>
        
        <Button
          variant="ghost"
          onClick={generateCanvas}
          disabled={isGenerating}
          size="sm"
        >
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  );
}; 