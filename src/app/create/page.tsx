'use client';

import React, { useState } from 'react';
import { MemeGenerator } from '@/components/meme/MemeGenerator';
import { MemeCreation } from '@/types';
import { Toast, ThemeToggle, ChatWidget } from '@/components/ui';
import Link from 'next/link';

export default function CreatePage() {
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    visible: boolean;
  } | null>(null);

  const handleSuccess = (meme: MemeCreation) => {
    setToast({
      type: 'success',
      message: `Meme "${meme.top_text || 'Untitled'}" created successfully!`,
      visible: true
    });
  };

  const handleError = (error: string) => {
    setToast({
      type: 'error',
      message: error,
      visible: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" data-theme="dark">
      {/* Header with Theme Toggle */}
      <header className="relative z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MemeGen
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <Link href="/">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Back to Gallery
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notifications */}
      <Toast
        type={toast?.type || 'info'}
        message={toast?.message || ''}
        visible={!!toast}
        onClose={() => setToast(null)}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your Meme
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Upload an image, add your text, and generate the perfect meme in seconds.
            </p>
          </div>

          {/* Meme Generator */}
          <MemeGenerator
            onSuccess={handleSuccess}
            onError={handleError}
            showPreview={true}
            showCanvas={true}
          />
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
} 