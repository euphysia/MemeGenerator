'use client';

import React from 'react';
import { MemeGenerator } from '@/components/meme/MemeGenerator';
import { MemeCreation } from '@/types';

interface MemeFormProps {
  initialData?: any;
  onSuccess?: (meme: MemeCreation) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const MemeForm: React.FC<MemeFormProps> = ({
  initialData,
  onSuccess,
  onError,
  className
}) => {
  return (
    <MemeGenerator
      initialData={initialData}
      onSuccess={onSuccess}
      onError={onError}
      className={className}
      showPreview={true}
      showCanvas={false}
    />
  );
}; 