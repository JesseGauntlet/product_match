"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProductFormProps {
  onSubmit: (website: string, description: string) => Promise<void>;
  isLoading: boolean;
}

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [websiteFocused, setWebsiteFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure the URL has https:// prefix when submitting
    const fullUrl = website.startsWith('http://') || website.startsWith('https://') 
      ? website 
      : `https://${website}`;
    await onSubmit(fullUrl, description);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <Label 
            htmlFor="website" 
            className={`transition-all duration-200 ${
              websiteFocused || website ? 
              'text-xs text-blue-600 font-semibold' : 
              'text-sm text-gray-600'
            }`}
          >
            Website URL
          </Label>
          <div className="relative mt-1 rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">https://</span>
            </div>
            <Input
              id="website"
              type="text"
              placeholder="yourwebsite.com"
              value={website}
              onChange={(e) => {
                // Remove https:// if user tries to paste it
                const value = e.target.value.replace(/^https?:\/\//, '');
                setWebsite(value);
              }}
              onFocus={() => setWebsiteFocused(true)}
              onBlur={() => setWebsiteFocused(false)}
              className={`pl-[105px] h-12 transition-all duration-200 ${
                websiteFocused ? 'border-orange-400 ring-2 ring-orange-100' : ''
              }`}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 ml-1">
            We&apos;ll analyze your website and search the web for additional information
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <Label 
            htmlFor="description" 
            className={`transition-all duration-200 ${
              descriptionFocused || description ? 
              'text-xs text-blue-600 font-semibold' : 
              'text-sm text-gray-600'
            }`}
          >
            Product Description (Optional)
          </Label>
          <div className="relative mt-1 rounded-lg shadow-sm">
            <div className="absolute left-3 top-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your product or service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              className={`pl-10 min-h-[100px] transition-all duration-200 ${
                descriptionFocused ? 'border-blue-400 ring-2 ring-blue-100' : ''
              }`}
              rows={3}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 ml-1">
            Adding a description can help provide more context about your product
          </p>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className={`w-full h-12 font-medium text-base transition-all duration-300 ${
          isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing with web search...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Analyze Product
          </>
        )}
      </Button>
      
      {isLoading && (
        <div className="text-sm text-center text-muted-foreground animate-pulse">
          This process may take a minute or two as we search the web for information about your product
        </div>
      )}
    </form>
  );
}
