"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProblemResult {
  id: string;
  similarity: number;
  subreddit: string;
  title: string;
  description: string;
}

interface ProblemSearchResultsProps {
  results: ProblemResult[];
}

export default function ProblemSearchResults({ results }: ProblemSearchResultsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-600">
        Similar Problems Found
      </h2>
      
      <div className="grid gap-4">
        {results.map((result) => (
          <Card 
            key={`${result.subreddit}_${result.id}`} 
            className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center">
                  <div className="mr-2 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <a 
                    href={`https://reddit.com/r/${result.subreddit}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-700 transition-colors"
                  >
                    r/{result.subreddit}
                  </a>
                </CardTitle>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                  {(result.similarity * 100).toFixed(1)}% match
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-2">{result.title}</h3>
              <p className="text-sm text-gray-600">{result.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No similar problems found. Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
} 