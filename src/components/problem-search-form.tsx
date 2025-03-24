"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ProblemSearchFormProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading: boolean;
}

export default function ProblemSearchForm({ onSubmit, isLoading }: ProblemSearchFormProps) {
  const [query, setQuery] = useState('');
  const [queryFocused, setQueryFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <Label 
            htmlFor="query" 
            className={`transition-all duration-200 ${
              queryFocused || query ? 
              'text-xs text-orange-600 font-semibold' : 
              'text-sm text-gray-600'
            }`}
          >
            Problem Description
          </Label>
          <div className="relative mt-1 rounded-lg shadow-sm">
            <div className="absolute left-3 top-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <Textarea
              id="query"
              placeholder="e.g. imposter syndrome or confidence issues"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setQueryFocused(true)}
              onBlur={() => setQueryFocused(false)}
              className={`pl-10 min-h-[100px] transition-all duration-200 ${
                queryFocused ? 'border-orange-400 ring-2 ring-orange-100' : ''
              }`}
              rows={3}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 ml-1">
            We&apos;ll find similar problems across all subreddit communities
          </p>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className={`w-full h-12 font-medium text-base transition-all duration-300 ${
          isLoading ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching problems...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Problems
          </>
        )}
      </Button>
      
      {isLoading && (
        <div className="text-sm text-center text-muted-foreground animate-pulse">
          Searching across all subreddit communities for similar problems...
        </div>
      )}
    </form>
  );
} 