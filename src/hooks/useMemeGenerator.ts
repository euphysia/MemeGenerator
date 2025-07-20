import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface UseMemeGeneratorOptions {
  initialData?: Partial<MemeFormData>;
  onSuccess?: (meme: MemeCreation) => void;
  onError?: (error: string) => void;
  autoRedirect?: boolean;
}

interface MemeGeneratorState {
  data: MemeFormData;
  errors: MemeFormErrors;
  isSubmitting: boolean;
  isGenerating: boolean;
  isUploading: boolean;
  uploadProgress: number;
  generatedCanvas: HTMLCanvasElement | null;
  previewUrl: string | null;
}

interface MemeGeneratorActions {
  updateFormData: (field: keyof MemeFormData, value: string) => void;
  handleFileUpload: (file: File) => Promise<void>;
  handleRandomImage: () => void;
  handleGenerateMeme: () => Promise<void>;
  handleDownload: () => void;
  handleCopyToClipboard: () => Promise<void>;
  handleSaveMeme: () => Promise<void>;
  handleReset: () => void;
  validateForm: () => boolean;
}

export const useMemeGenerator = (options: UseMemeGeneratorOptions = {}): [MemeGeneratorState, MemeGeneratorActions] => {
  const router = useRouter();
  const { initialData, onSuccess, onError, autoRedirect = true } = options;

  // State management
  const [state, setState] = useState<MemeGeneratorState>({
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

  // Validate form on data change
  useEffect(() => {
    const errors = validateMemeForm(state.data);
    setState(prev => ({ ...prev, errors }));
  }, [state.data]);

  // Update form data
  const updateFormData = useCallback((field: keyof MemeFormData, value: string) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined }
    }));
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors = validateMemeForm(state.data);
    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [state.data]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File): Promise<void> => {
    // Validate file
    const validation = validateImageForMeme(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid file');
    }

    setState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0 
    }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 100);

      // Upload to Supabase
      const imageUrl = await uploadImage(file);
      
      clearInterval(progressInterval);
      
      setState(prev => ({
        ...prev,
        data: { ...prev.data, image_url: imageUrl },
        uploadProgress: 100,
        isUploading: false
      }));
      
      // Clear progress after delay
      setTimeout(() => {
        setState(prev => ({ ...prev, uploadProgress: 0 }));
      }, 1000);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 0 
      }));
      throw error;
    }
  }, []);

  // Handle random image
  const handleRandomImage = useCallback(() => {
    const randomUrl = getRandomPlaceholderImage();
    updateFormData('image_url', randomUrl);
  }, [updateFormData]);

  // Generate meme canvas
  const handleGenerateMeme = useCallback(async (): Promise<void> => {
    if (!state.data.image_url) {
      throw new Error('Please select an image first');
    }

    if (!state.data.top_text && !state.data.bottom_text) {
      throw new Error('Please add at least one text field');
    }

    if (!validateForm()) {
      throw new Error('Please fix form errors');
    }

    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      const canvas = await generateMemeCanvas(
        state.data.image_url,
        state.data.top_text,
        state.data.bottom_text,
        { width: 800, height: 600, quality: 0.9 }
      );

      const dataUrl = canvas.toDataURL('image/png', 0.9);

      setState(prev => ({
        ...prev,
        generatedCanvas: canvas,
        previewUrl: dataUrl,
        isGenerating: false
      }));

    } catch (error) {
      setState(prev => ({ ...prev, isGenerating: false }));
      throw error;
    }
  }, [state.data, validateForm]);

  // Download meme
  const handleDownload = useCallback(() => {
    if (!state.generatedCanvas) {
      throw new Error('Please generate a meme first');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `meme-${timestamp}.png`;
    downloadMeme(state.generatedCanvas, filename);
  }, [state.generatedCanvas]);

  // Copy to clipboard
  const handleCopyToClipboard = useCallback(async (): Promise<void> => {
    if (!state.generatedCanvas) {
      throw new Error('Please generate a meme first');
    }

    const blob = await canvasToBlob(state.generatedCanvas);
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  }, [state.generatedCanvas]);

  // Save meme to database
  const handleSaveMeme = useCallback(async (): Promise<void> => {
    if (!state.generatedCanvas) {
      throw new Error('Please generate a meme first');
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Convert canvas to blob for storage
      const blob = await canvasToBlob(state.generatedCanvas);
      
      // Create a file from blob for upload
      const file = new File([blob], `meme-${Date.now()}.png`, { type: 'image/png' });
      
      // Upload the generated meme image
      const imageUrl = await uploadImage(file);
      
      // Save meme data to database
      const meme = await createMeme({
        image_url: imageUrl,
        top_text: state.data.top_text,
        bottom_text: state.data.bottom_text
      });

      onSuccess?.(meme);
      
      // Redirect to home page after short delay
      if (autoRedirect) {
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }

    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to save meme');
      throw error;
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.generatedCanvas, state.data, onSuccess, onError, autoRedirect, router]);

  // Reset form
  const handleReset = useCallback(() => {
    setState({
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
  }, []);

  // Actions object
  const actions: MemeGeneratorActions = {
    updateFormData,
    handleFileUpload,
    handleRandomImage,
    handleGenerateMeme,
    handleDownload,
    handleCopyToClipboard,
    handleSaveMeme,
    handleReset,
    validateForm
  };

  return [state, actions];
}; 