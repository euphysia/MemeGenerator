'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardContent, CardFooter, Counter } from '@/components/ui';

export default function ComponentsDemoPage() {
  const [counterValue, setCounterValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    // Simulate counter animation
    const timer = setTimeout(() => {
      setCounterValue(1234);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    alert('Form submitted!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            UI Components Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Showcasing enhanced components with modern design
          </p>
        </div>

        {/* Counter Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Counter Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Counter
              value={counterValue}
              title="Total Memes"
              subtitle="Created today"
              variant="default"
              size="md"
            />
            <Counter
              value={567}
              title="Active Users"
              subtitle="Online now"
              variant="glass"
              size="md"
            />
            <Counter
              value={8901}
              title="Downloads"
              subtitle="This month"
              variant="gradient"
              size="md"
            />
          </div>
        </section>

        {/* Button Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Button Components
          </h2>
          
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Button Variants</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="gradient">Gradient</Button>
                <Button variant="glass">Glass</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Button Sizes</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Button States</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button 
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  With Icon
                </Button>
                <Button 
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                  iconPosition="right"
                >
                  Icon Right
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Input Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Input Variants</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Default Input"
                  placeholder="Enter your name"
                  helperText="This is a helper text"
                />
                <Input
                  label="Glass Input"
                  placeholder="Glass effect input"
                  variant="glass"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                <Input
                  label="File Input"
                  type="file"
                  variant="file"
                  accept="image/*"
                  helperText="Upload an image file"
                />
                <Input
                  label="Input with Error"
                  placeholder="This input has an error"
                  error="This field is required"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Form Example</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    label="Message"
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  <Button type="submit" loading={loading} className="w-full">
                    Submit Form
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Card Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Card Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" hover>
              <CardHeader>
                <h3 className="text-lg font-semibold">Default Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  This is a default card with hover effect.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="glass">
              <CardHeader variant="glass">
                <h3 className="text-lg font-semibold">Glass Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  This card has a glass morphism effect.
                </p>
              </CardContent>
              <CardFooter variant="glass">
                <Button variant="glass" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Elevated Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  This card has enhanced elevation and shadows.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-lg font-semibold">Bordered Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  This card has a prominent border.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Interactive Demo</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try interacting with the components above. All components feature:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Modern gradient backgrounds and glass morphism effects</li>
                <li>• Smooth animations and hover states</li>
                <li>• Mobile-responsive design</li>
                <li>• Accessibility compliance (ARIA labels, keyboard navigation)</li>
                <li>• Inter font family throughout</li>
                <li>• Dark mode support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="gradient" size="lg">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
} 