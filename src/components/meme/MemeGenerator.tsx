'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';
import { Button, Input, Toast } from '@/components/ui';
import { MemeCanvas, MemePreview } from '@/components/meme';
import { MemeFormData, MemeFormErrors, MemeCreation } from '@/types';
import { 
  validateMemeForm, 
  uploadImage, 
  createMeme, 
  validateImageForMeme,
  getRandomPlaceholderImage,
  generateMemeCanvas,
  downloadMeme,
  canvasToBlob
} from '@/lib/utils';
import { optimizeImageForUpload, createImageThumbnail } from '@/lib/imageOptimization';

interface MemeGeneratorProps {
  initialData?: Partial<MemeFormData>;
  onSuccess?: (meme: MemeCreation) => void;
  onError?: (error: string) => void;
  className?: string;
  showPreview?: boolean;
  showCanvas?: boolean;
}

interface FormState {
  data: MemeFormData;
  errors: MemeFormErrors;
  isSubmitting: boolean;
  isGenerating: boolean;
  isUploading: boolean;
  uploadProgress: number;
  generatedCanvas: HTMLCanvasElement | null;
  previewUrl: string | null;
}

export const MemeGenerator: React.FC<MemeGeneratorProps> = ({
  initialData,
  onSuccess,
  onError,
  className,
  showPreview = true,
  showCanvas = false
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Form state management
  const [formState, setFormState] = useState<FormState>({
    data: {
      image_url: initialData?.image_url || getRandomPlaceholderImage(),
      top_text: initialData?.top_text || '',
      bottom_text: initialData?.bottom_text || ''
    },
    errors: {},
    isSubmitting: false,
    isGenerating: false,
    isUploading: false,
    uploadProgress: 0,
    generatedCanvas: null,
    previewUrl: null
  });

  // Toast notifications
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    visible: boolean;
  } | null>(null);

  // Validate form on data change
  useEffect(() => {
    const errors = validateMemeForm(formState.data);
    setFormState(prev => ({ ...prev, errors }));
  }, [formState.data]);

  // Show toast notification
  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Update form data
  const updateFormData = useCallback((field: keyof MemeFormData, value: string) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined }
    }));
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageForMeme(file);
    if (!validation.isValid) {
      showToast('error', validation.error || 'Invalid file');
      return;
    }

    setFormState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0 
    }));

    try {
      // Optimize image before upload
      showToast('info', 'Optimizing image...');
      const optimizedImage = await optimizeImageForUpload(file);
      
      // Create thumbnail for preview
      const thumbnail = await createImageThumbnail(file);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFormState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 100);

      // Upload optimized image to Supabase
      const optimizedFile = new File([optimizedImage.blob], file.name, { type: optimizedImage.blob.type });
      const imageUrl = await uploadImage(optimizedFile);
      
      clearInterval(progressInterval);
      
      setFormState(prev => ({
        ...prev,
        data: { ...prev.data, image_url: imageUrl },
        uploadProgress: 100,
        isUploading: false
      }));

      const compressionPercent = Math.round(optimizedImage.compressionRatio * 100);
      showToast('success', `Image uploaded successfully! (${compressionPercent}% smaller)`);
      
      // Clear progress after delay
      setTimeout(() => {
        setFormState(prev => ({ ...prev, uploadProgress: 0 }));
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      showToast('error', errorMessage);
      setFormState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 0 
      }));
    }
  }, [showToast]);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // Handle random image
  const handleRandomImage = useCallback(() => {
    const randomUrl = getRandomPlaceholderImage();
    updateFormData('image_url', randomUrl);
    showToast('info', 'Random image selected');
  }, [updateFormData, showToast]);

  // Generate meme canvas
  const handleGenerateMeme = useCallback(async () => {
    if (!formState.data.image_url) {
      showToast('error', 'Please select an image first');
      return;
    }

    if (!formState.data.top_text && !formState.data.bottom_text) {
      showToast('error', 'Please add at least one text field');
      return;
    }

    setFormState(prev => ({ ...prev, isGenerating: true }));

    try {
      const canvas = await generateMemeCanvas(
        formState.data.image_url,
        formState.data.top_text,
        formState.data.bottom_text,
        { width: 800, height: 600, quality: 0.9 }
      );

      const dataUrl = canvas.toDataURL('image/png', 0.9);

      setFormState(prev => ({
        ...prev,
        generatedCanvas: canvas,
        previewUrl: dataUrl,
        isGenerating: false
      }));

      showToast('success', 'Meme generated successfully!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate meme';
      showToast('error', errorMessage);
      setFormState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [formState.data, showToast]);

  // Download meme
  const handleDownload = useCallback(() => {
    if (!formState.generatedCanvas) {
      showToast('error', 'Please generate a meme first');
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `meme-${timestamp}.png`;
      downloadMeme(formState.generatedCanvas, filename);
      showToast('success', 'Meme downloaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      showToast('error', errorMessage);
    }
  }, [formState.generatedCanvas, showToast]);

  // Copy to clipboard
  const handleCopyToClipboard = useCallback(async () => {
    if (!formState.generatedCanvas) {
      showToast('error', 'Please generate a meme first');
      return;
    }

    try {
      const blob = await canvasToBlob(formState.generatedCanvas);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showToast('success', 'Meme copied to clipboard!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Copy failed';
      showToast('error', errorMessage);
    }
  }, [formState.generatedCanvas, showToast]);

  // Save meme to database
  const handleSaveMeme = useCallback(async () => {
    if (!formState.generatedCanvas) {
      showToast('error', 'Please generate a meme first');
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Convert canvas to blob for storage
      const blob = await canvasToBlob(formState.generatedCanvas);
      
      // Create a file from blob for upload
      const file = new File([blob], `meme-${Date.now()}.png`, { type: 'image/png' });
      
      // Upload the generated meme image
      const imageUrl = await uploadImage(file);
      
      // Save meme data to database
      const meme = await createMeme({
        image_url: imageUrl,
        top_text: formState.data.top_text,
        bottom_text: formState.data.bottom_text
      });

      showToast('success', 'Meme saved successfully!');
      onSuccess?.(meme);
      
      // Redirect to home page after short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save meme';
      showToast('error', errorMessage);
      onError?.(errorMessage);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.generatedCanvas, formState.data, showToast, onSuccess, onError, router]);

  // Reset form
  const handleReset = useCallback(() => {
    setFormState({
      data: {
        image_url: getRandomPlaceholderImage(),
        top_text: '',
        bottom_text: ''
      },
      errors: {},
      isSubmitting: false,
      isGenerating: false,
      isUploading: false,
      uploadProgress: 0,
      generatedCanvas: null,
      previewUrl: null
    });
    showToast('info', 'Form reset');
  }, [showToast]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toast Notifications */}
      <Toast
        type={toast?.type || 'info'}
        message={toast?.message || ''}
        visible={!!toast}
        onClose={() => setToast(null)}
      />

      {/* Form Section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Create Your Meme</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Upload an image, add your text, and generate the perfect meme.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Image Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Source
              </label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomImage}
                  disabled={formState.isUploading}
                  className="flex-1"
                  size="sm"
                >
                  Random Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={formState.isUploading}
                  className="flex-1"
                  size="sm"
                >
                  Upload Image
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Input
                label="Image URL"
                placeholder="Or paste image URL here..."
                value={formState.data.image_url}
                onChange={(e) => updateFormData('image_url', e.target.value)}
                error={formState.errors.image_url}
                helperText="Supports JPEG and PNG images"
                disabled={formState.isUploading}
              />

              {/* Upload Progress */}
              {formState.uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${formState.uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Uploading... {formState.uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Top Caption"
                placeholder="Enter top text..."
                value={formState.data.top_text}
                onChange={(e) => updateFormData('top_text', e.target.value)}
                error={formState.errors.top_text}
                helperText="Max 50 characters"
                maxLength={50}
                disabled={formState.isGenerating}
              />
              
              <Input
                label="Bottom Caption"
                placeholder="Enter bottom text..."
                value={formState.data.bottom_text}
                onChange={(e) => updateFormData('bottom_text', e.target.value)}
                error={formState.errors.bottom_text}
                helperText="Max 50 characters"
                maxLength={50}
                disabled={formState.isGenerating}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateMeme}
                loading={formState.isGenerating}
                disabled={Object.keys(formState.errors).length > 0 || !formState.data.image_url}
                className="flex-1"
                size="lg"
              >
                Generate Meme
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={formState.isGenerating || formState.isSubmitting}
                size="lg"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemePreview
            imageUrl={formState.data.image_url}
            topText={formState.data.top_text}
            bottomText={formState.data.bottom_text}
            onError={(error) => showToast('error', error)}
          />

          {showCanvas && formState.generatedCanvas && (
            <MemeCanvas
              imageUrl={formState.data.image_url}
              topText={formState.data.top_text}
              bottomText={formState.data.bottom_text}
              onCanvasReady={() => {}}
              onError={(error) => showToast('error', error)}
            />
          )}
        </div>
      )}

      {/* Generated Meme Actions */}
      {formState.generatedCanvas && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Your Generated Meme</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleDownload}
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
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
              >
                Copy to Clipboard
              </Button>
              
              <Button
                variant="gradient"
                onClick={handleSaveMeme}
                loading={formState.isSubmitting}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Save to Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 