// Meme data structure
export interface MemeCreation {
  id: string;
  image_url: string;
  top_text: string;
  bottom_text: string;
  created_at: string;
}

// Form data interfaces
export interface MemeFormData {
  image_url: string;
  top_text: string;
  bottom_text: string;
}

export interface MemeFormErrors {
  image_url?: string;
  top_text?: string;
  bottom_text?: string;
}

// Supabase response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export interface SupabaseMemeResponse {
  data: MemeCreation[] | null;
  error: any;
  count: number | null;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Component props
export interface MemeCardProps {
  meme: MemeCreation;
  onEdit?: (meme: MemeCreation) => void;
  onDelete?: (id: string) => void;
}

export interface MemeFormProps {
  initialData?: Partial<MemeFormData>;
  onSubmit: (data: MemeFormData) => void;
  isLoading?: boolean;
}

// Task 2: Additional types

// Storage types
export interface StorageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface StorageFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Database schema types
export interface MemeData {
  image_url: string;
  top_text: string;
  bottom_text: string;
}

// Enhanced API response wrapper
export interface ApiResponseWrapper<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// File upload types
export interface FileUploadData {
  file: File;
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

// Database operation types
export interface DatabaseOperation<T> {
  operation: 'create' | 'read' | 'update' | 'delete';
  table: string;
  data?: T;
  id?: string;
  filters?: Record<string, any>;
}

// Storage bucket configuration
export interface StorageBucketConfig {
  name: string;
  public: boolean;
  allowedMimeTypes: string[];
  maxFileSize: number;
  allowedExtensions: string[];
} 