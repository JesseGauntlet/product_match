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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(website, description);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourwebsite.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          We'll analyze your website and search the web for additional information
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Product Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Describe your product or service"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Adding a description can help provide more context about your product
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing with web search...
          </>
        ) : 'Analyze Product'}
      </Button>
      
      {isLoading && (
        <div className="text-sm text-center text-muted-foreground">
          This process may take a minute or two as we search the web for information about your product
        </div>
      )}
    </form>
  );
}
