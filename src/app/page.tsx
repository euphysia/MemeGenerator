'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MemeCard, MemeCanvas, MemePreview } from '@/components/meme';
import { Button, Counter, Card, CardContent, ThemeToggle, ChatWidget } from '@/components/ui';
import { MemeCreation } from '@/types';
import { memeService } from '@/lib/supabase';
import { getMemeCount } from '@/lib/utils';
import { getRandomPlaceholderImage } from '@/lib/utils';

export default function Home() {
  const [memes, setMemes] = useState<MemeCreation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memeCount, setMemeCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);
  
  // Form state for hero section
  const [formData, setFormData] = useState({
    image_url: getRandomPlaceholderImage(),
    top_text: '',
    bottom_text: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadMemes();
    loadMemeCount();
  }, []);

  const loadMemes = async () => {
    try {
      const response = await memeService.getAllMemes();
      if (response.data) {
        setMemes(response.data);
      }
    } catch (error) {
      console.error('Error loading memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMemeCount = async () => {
    try {
      const count = await getMemeCount();
      setMemeCount(count);
    } catch (error) {
      console.error('Error loading meme count:', error);
    } finally {
      setCountLoading(false);
    }
  };

  const handleDeleteMeme = async (id: string) => {
    if (confirm('Are you sure you want to delete this meme?')) {
      try {
        await memeService.deleteMeme(id);
        setMemes(prev => prev.filter(meme => meme.id !== id));
        loadMemeCount();
      } catch (error) {
        console.error('Error deleting meme:', error);
        alert('Failed to delete meme. Please try again.');
      }
    }
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRandomImage = () => {
    setFormData(prev => ({ ...prev, image_url: getRandomPlaceholderImage() }));
  };

  const handleGenerateMeme = () => {
    setShowPreview(true);
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
              <Link href="/create">
                <Button size="sm">
                  Create Meme
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Two-Column Layout */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Hero Section */}
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
              
              {/* Main Hero Content */}
              <div className="relative z-10">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  <span className="text-gray-900 dark:text-white">Create</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Amazing Memes
                  </span>
                  <span className="text-gray-900 dark:text-white">in Seconds</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  Transform any image into a viral meme with our powerful generator. 
                  Add text, download, and share instantly!
                </p>

                {/* Animated Meme Examples */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="relative group">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                      <div className="w-full h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded mb-2 relative overflow-hidden">
                        {/* Sample meme image background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-700/80"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-lg">WHEN YOU</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-lg">FINISH THE PROJECT</span>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full"></div>
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1">
                      <div className="w-full h-24 bg-gradient-to-br from-green-600 to-blue-700 rounded mb-2 relative overflow-hidden">
                        {/* Sample meme image background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-blue-700/80"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-lg">ME TRYING TO</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-lg">DEBUG MY CODE</span>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full"></div>
                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">10,000+</span> happy users
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Counter
                    value={memeCount}
                    title="Memes Created"
                    variant="purple"
                    size="sm"
                    loading={countLoading}
                  />
                  <Counter
                    value={1234}
                    title="Active Users"
                    variant="purple"
                    size="sm"
                  />
                  <Counter
                    value={5678}
                    title="Downloads"
                    variant="purple"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="relative">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-gray-300/50 dark:border-gray-600/50 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Generate Your Meme in Seconds
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      Upload an image, add your text, and download your meme instantly.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Image Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                        Image Source
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRandomImage}
                          className="flex-1"
                          size="sm"
                        >
                          Random Image
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('hero-file-input')?.click()}
                          className="flex-1"
                          size="sm"
                        >
                          Upload Image
                        </Button>
                      </div>
                      <input
                        id="hero-file-input"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            handleFormChange('image_url', url);
                          }
                        }}
                      />
                      <input
                        type="url"
                        placeholder="Or paste image URL here..."
                        value={formData.image_url}
                        onChange={(e) => handleFormChange('image_url', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Text Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                          Top Caption
                        </label>
                        <input
                          type="text"
                          placeholder="Enter top text..."
                          value={formData.top_text}
                          onChange={(e) => handleFormChange('top_text', e.target.value)}
                          maxLength={50}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                          Bottom Caption
                        </label>
                        <input
                          type="text"
                          placeholder="Enter bottom text..."
                          value={formData.bottom_text}
                          onChange={(e) => handleFormChange('bottom_text', e.target.value)}
                          maxLength={50}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerateMeme}
                      disabled={!formData.image_url}
                      className="w-full py-4 text-lg font-semibold"
                      size="lg"
                    >
                      Generate Meme
                    </Button>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Link href="/create" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Advanced Editor
                        </Button>
                      </Link>
                      <Link href="/meme-demo" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Try Demo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview */}
              {showPreview && (
                <div className="mt-6">
                  <MemePreview
                    imageUrl={formData.image_url}
                    topText={formData.top_text}
                    bottomText={formData.bottom_text}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Memes Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Memes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what others are creating with our meme generator
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading memes...</p>
            </div>
          ) : memes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memes.slice(0, 8).map((meme) => (
                <MemeCard
                  key={meme.id}
                  meme={meme}
                  onDelete={handleDeleteMeme}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No memes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Be the first to create a meme!
              </p>
              <Link href="/create">
                <Button>Create Your First Meme</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate memes in seconds with our optimized canvas engine
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                High Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Professional-grade output with crisp text and perfect scaling
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Easy Sharing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Download or copy to clipboard for instant social media sharing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
