'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { Button, Input } from '@/components/ui';
import { MemeCanvas, MemePreview } from '@/components/meme';
import { getRandomPlaceholderImage } from '@/lib/utils';

export default function MemeDemoPage() {
  const [imageUrl, setImageUrl] = useState(getRandomPlaceholderImage());
  const [topText, setTopText] = useState('WHEN YOU');
  const [bottomText, setBottomText] = useState('FINISH THE PROJECT');
  const [showCanvas, setShowCanvas] = useState(true);

  const handleRandomImage = () => {
    setImageUrl(getRandomPlaceholderImage());
  };

  const handleRandomMeme = () => {
    const memeTexts = [
      { top: 'WHEN YOU', bottom: 'FINISH THE PROJECT' },
      { top: 'ME TRYING TO', bottom: 'DEBUG MY CODE' },
      { top: 'PROGRAMMERS BE LIKE', bottom: 'IT WORKS ON MY MACHINE' },
      { top: 'WHEN THE', bottom: 'CODE COMPILES FIRST TRY' },
      { top: 'ME AFTER', bottom: 'FIXING ONE BUG' },
      { top: 'WHEN SOMEONE ASKS', bottom: 'HOW THE CODE WORKS' }
    ];
    
    const randomMeme = memeTexts[Math.floor(Math.random() * memeTexts.length)];
    setTopText(randomMeme.top);
    setBottomText(randomMeme.bottom);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meme Generator Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the power of our meme generation engine with real-time preview, 
            canvas rendering, and instant downloads.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Quick Controls</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={handleRandomImage} variant="outline" className="w-full">
                Random Image
              </Button>
              <Button onClick={handleRandomMeme} variant="outline" className="w-full">
                Random Meme Text
              </Button>
              <Button 
                onClick={() => setShowCanvas(!showCanvas)} 
                variant="outline" 
                className="w-full"
              >
                {showCanvas ? 'Hide Canvas' : 'Show Canvas'}
              </Button>
              <Button 
                onClick={() => {
                  setTopText('');
                  setBottomText('');
                }} 
                variant="outline" 
                className="w-full"
              >
                Clear Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Customize Your Meme</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                helperText="Paste any image URL to use as your meme base"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Top Text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  maxLength={50}
                />
                
                <Input
                  label="Bottom Text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text..."
                  maxLength={50}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MemePreview
            imageUrl={imageUrl}
            topText={topText}
            bottomText={bottomText}
          />

          {showCanvas && (
            <MemeCanvas
              imageUrl={imageUrl}
              topText={topText}
              bottomText={bottomText}
            />
          )}
        </div>

        {/* Features Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold">🎨 Live Preview</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                See your meme come to life in real-time as you type. 
                Text automatically scales and positions for optimal readability.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold">⚡ Canvas Generation</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                High-quality canvas rendering with proper text styling, 
                shadows, and professional meme formatting.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold">💾 Download Ready</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Download your meme as PNG or copy to clipboard. 
                Perfect for sharing on social media platforms.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Technical Features</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Canvas Generation</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• HTML5 Canvas for high-quality rendering</li>
                  <li>• Automatic image scaling and centering</li>
                  <li>• Impact font with black stroke for readability</li>
                  <li>• Dynamic text sizing based on content length</li>
                  <li>• PNG export with configurable quality</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Preview System</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Real-time text overlay positioning</li>
                  <li>• CSS text shadows for contrast</li>
                  <li>• Responsive design for all screen sizes</li>
                  <li>• Loading states and error handling</li>
                  <li>• Cross-origin image support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 