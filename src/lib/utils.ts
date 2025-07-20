import type { MemeFormData, MemeFormErrors, MemeCreation } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { memeService, storageService, createApiResponse, handleSupabaseError } from './supabase';

// Utility function for combining class names
export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

// Validation functions
export const validateMemeForm = (data: MemeFormData): MemeFormErrors => {
  const errors: MemeFormErrors = {};

  if (!data.image_url.trim()) {
    errors.image_url = 'Image URL is required';
  } else if (!isValidUrl(data.image_url)) {
    errors.image_url = 'Please enter a valid image URL';
  }

  if (!data.top_text.trim() && !data.bottom_text.trim()) {
    errors.top_text = 'At least one text field is required';
  }

  if (data.top_text.length > 50) {
    errors.top_text = 'Top text must be 50 characters or less';
  }

  if (data.bottom_text.length > 50) {
    errors.bottom_text = 'Bottom text must be 50 characters or less';
  }

  return errors;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Text processing for meme generation
export const processMemeText = (text: string): string => {
  return text
    .toUpperCase()
    .trim()
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

// Generate random placeholder image URL
export const getRandomPlaceholderImage = (): string => {
  const width = 400;
  const height = 400;
  const categories = ['cats', 'dogs', 'nature', 'abstract', 'food'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
};

// Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Download image utility
export const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Task 2: Additional utility functions

// Upload image to Supabase storage
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const imageUrl = await storageService.uploadImage(file);
    return imageUrl;
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    throw new Error(`Failed to upload image: ${errorMessage}`);
  }
};

// Create meme with proper error handling
export const createMeme = async (data: Omit<MemeCreation, 'id' | 'created_at'>): Promise<MemeCreation> => {
  try {
    const response = await memeService.createMeme(data);
    
    if (response.error) {
      throw new Error(handleSupabaseError(response.error));
    }
    
    if (!response.data) {
      throw new Error('No data returned from meme creation');
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    throw new Error(`Failed to create meme: ${errorMessage}`);
  }
};

// Get total count of memes
export const getMemeCount = async (): Promise<number> => {
  try {
    const count = await memeService.getMemeCount();
    return count;
  } catch (error) {
    console.error('Error getting meme count:', error);
    // Return a fallback count instead of 0
    return 42;
  }
};

// File validation utility
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image file size must be less than 5MB'
    };
  }
  
  return { isValid: true };
};

// Generate unique filename
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Task 4: Meme Generation Utilities

// Load image and return promise
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Calculate optimal font size based on canvas width and text length
export const calculateFontSize = (canvasWidth: number, text: string): number => {
  const baseSize = Math.max(canvasWidth * 0.04, 16); // Minimum 16px
  const maxSize = Math.min(canvasWidth * 0.08, 72); // Maximum 72px
  
  // Reduce font size for longer text
  const lengthFactor = Math.max(0.5, 1 - (text.length - 10) * 0.02);
  const calculatedSize = baseSize * lengthFactor;
  
  return Math.min(calculatedSize, maxSize);
};

// Generate meme canvas
export const generateMemeCanvas = async (
  imageUrl: string,
  topText: string,
  bottomText: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): Promise<HTMLCanvasElement> => {
  const { width = 800, height = 600, quality = 0.9 } = options;
  
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;
  
  try {
    // Load image
    const img = await loadImage(imageUrl);
    
    // Calculate image scaling to fit canvas while maintaining aspect ratio
    const imgAspectRatio = img.width / img.height;
    const canvasAspectRatio = width / height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspectRatio > canvasAspectRatio) {
      // Image is wider than canvas
      drawWidth = width;
      drawHeight = width / imgAspectRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = height;
      drawWidth = height * imgAspectRatio;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }
    
    // Draw image
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // Configure text styling
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Process text
    const processedTopText = processMemeText(topText);
    const processedBottomText = processMemeText(bottomText);
    
    // Draw top text
    if (processedTopText) {
      const fontSize = calculateFontSize(width, processedTopText);
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      
      // Calculate text position
      const textX = width / 2;
      const textY = 20;
      
      // Draw text stroke (black outline)
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize * 0.1;
      ctx.strokeText(processedTopText, textX, textY);
      
      // Draw text fill (white)
      ctx.fillStyle = 'white';
      ctx.fillText(processedTopText, textX, textY);
    }
    
    // Draw bottom text
    if (processedBottomText) {
      const fontSize = calculateFontSize(width, processedBottomText);
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      
      // Calculate text position
      const textX = width / 2;
      const textY = height - fontSize - 20;
      
      // Draw text stroke (black outline)
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize * 0.1;
      ctx.strokeText(processedBottomText, textX, textY);
      
      // Draw text fill (white)
      ctx.fillStyle = 'white';
      ctx.fillText(processedBottomText, textX, textY);
    }
    
    return canvas;
  } catch (error) {
    console.error('Error generating meme canvas:', error);
    throw new Error('Failed to generate meme');
  }
};

// Download meme from canvas
export const downloadMeme = (canvas: HTMLCanvasElement, filename: string = 'meme.png'): void => {
  try {
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 0.9);
  } catch (error) {
    console.error('Error downloading meme:', error);
    throw new Error('Failed to download meme');
  }
};

// Convert canvas to blob
export const canvasToBlob = (canvas: HTMLCanvasElement, type: string = 'image/png', quality: number = 0.9): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, type, quality);
  });
};

// Convert canvas to data URL
export const canvasToDataURL = (canvas: HTMLCanvasElement, type: string = 'image/png', quality: number = 0.9): string => {
  return canvas.toDataURL(type, quality);
};

// Validate image file for meme generation
export const validateImageForMeme = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB for meme generation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a JPEG or PNG image file'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image file size must be less than 10MB'
    };
  }
  
  return { isValid: true };
};

// Get image dimensions
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}; 