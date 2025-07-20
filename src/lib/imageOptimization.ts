interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  compressionLevel?: number;
}

interface OptimizedImage {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

export class ImageOptimizer {
  private static readonly DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'jpeg',
    compressionLevel: 6
  };

  /**
   * Optimize image before upload
   */
  static async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const originalSize = file.size;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          const { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            opts.maxWidth,
            opts.maxHeight
          );

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to desired format
          const mimeType = this.getMimeType(opts.format);
          const dataUrl = canvas.toDataURL(mimeType, opts.quality);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedSize = blob.size;
                const compressionRatio = (originalSize - optimizedSize) / originalSize;

                resolve({
                  blob,
                  dataUrl,
                  originalSize,
                  optimizedSize,
                  compressionRatio
                });
              } else {
                reject(new Error('Failed to create optimized image blob'));
              }
            },
            mimeType,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Scale down if image is too large
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Get MIME type for format
   */
  private static getMimeType(format: string): string {
    switch (format) {
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  /**
   * Check if WebP is supported
   */
  static isWebPSupported(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }

  /**
   * Get optimal format based on browser support
   */
  static getOptimalFormat(): 'jpeg' | 'png' | 'webp' {
    if (this.isWebPSupported()) {
      return 'webp';
    }
    return 'jpeg';
  }

  /**
   * Create thumbnail for preview
   */
  static async createThumbnail(
    file: File,
    size: number = 200
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate thumbnail dimensions
          const aspectRatio = img.width / img.height;
          let thumbWidth = size;
          let thumbHeight = size;

          if (aspectRatio > 1) {
            thumbHeight = size / aspectRatio;
          } else {
            thumbWidth = size * aspectRatio;
          }

          canvas.width = thumbWidth;
          canvas.height = thumbHeight;

          // Draw thumbnail
          ctx?.drawImage(img, 0, 0, thumbWidth, thumbHeight);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Validate image dimensions
   */
  static async validateImageDimensions(
    file: File,
    minWidth: number = 100,
    minHeight: number = 100,
    maxWidth: number = 5000,
    maxHeight: number = 5000
  ): Promise<{ isValid: boolean; width: number; height: number; error?: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        
        if (width < minWidth || height < minHeight) {
          resolve({
            isValid: false,
            width,
            height,
            error: `Image too small. Minimum size: ${minWidth}x${minHeight}px`
          });
        } else if (width > maxWidth || height > maxHeight) {
          resolve({
            isValid: false,
            width,
            height,
            error: `Image too large. Maximum size: ${maxWidth}x${maxHeight}px`
          });
        } else {
          resolve({ isValid: true, width, height });
        }
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          width: 0,
          height: 0,
          error: 'Failed to load image'
        });
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

/**
 * Utility function to optimize image with default settings
 */
export const optimizeImageForUpload = async (file: File): Promise<OptimizedImage> => {
  const format = ImageOptimizer.getOptimalFormat();
  return ImageOptimizer.optimizeImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format,
    compressionLevel: 6
  });
};

/**
 * Utility function to create thumbnail
 */
export const createImageThumbnail = async (file: File): Promise<string> => {
  return ImageOptimizer.createThumbnail(file, 200);
};

/**
 * Utility function to validate image
 */
export const validateImageForUpload = async (file: File): Promise<{
  isValid: boolean;
  width: number;
  height: number;
  error?: string;
}> => {
  return ImageOptimizer.validateImageDimensions(file, 100, 100, 5000, 5000);
}; 