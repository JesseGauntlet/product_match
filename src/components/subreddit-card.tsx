"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProblemEvaluation {
  id: string;
  title?: string;
  description: string;
  relevant?: boolean;
  recommendation?: string;
}

interface SubredditCardProps {
  subreddit: string;
  description: string;
  problems: {
    id: string;
    title?: string;
    description: string;
  }[];
  productSummary: string;
  onEvaluateProblem: (problem: {
    id: string;
    description: string;
  }, productSummary: string) => Promise<{
    relevant: boolean;
    recommendation: string;
  }>;
  onProblemSelect?: (problem: {
    id: string;
    subredditName: string;
    title?: string;
    description: string;
    evaluation?: {
      relevant: boolean;
      recommendation: string;
    };
  }) => void;
  selectedProblem?: {
    id: string;
    subredditName: string;
    title?: string;
    description: string;
    evaluation?: {
      relevant: boolean;
      recommendation: string;
    };
  };
  compact?: boolean;
}

export default function SubredditCard({
  subreddit,
  description,
  problems,
  productSummary,
  onEvaluateProblem,
  onProblemSelect,
  selectedProblem,
  compact = false
}: SubredditCardProps) {
  const [evaluations, setEvaluations] = useState<Record<string, ProblemEvaluation>>({});
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  const handleEvaluate = async (problem: { id: string; description: string; title?: string }, preventSelect = false) => {
    if (evaluations[problem.id]) {
      // If already evaluated and we have a select handler, call it
      if (onProblemSelect && !preventSelect) {
        onProblemSelect({
          id: problem.id,
          subredditName: subreddit,
          title: problem.title,
          description: problem.description,
          evaluation: {
            relevant: evaluations[problem.id].relevant!,
            recommendation: evaluations[problem.id].recommendation!
          }
        });
      }
      return;
    }
    
    setEvaluatingId(problem.id);
    try {
      const result = await onEvaluateProblem(problem, productSummary);
      const updatedEvaluation = {
        ...problem,
        relevant: result.relevant,
        recommendation: result.recommendation
      };
      
      setEvaluations(prev => ({
        ...prev,
        [problem.id]: updatedEvaluation
      }));
      
      // After evaluation, if we have a select handler, call it with the updated evaluation
      if (onProblemSelect) {
        onProblemSelect({
          id: problem.id,
          subredditName: subreddit,
          title: problem.title,
          description: problem.description,
          evaluation: {
            relevant: result.relevant,
            recommendation: result.recommendation
          }
        });
      }
    } catch (error) {
      console.error('Error evaluating problem:', error);
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleProblemClick = (problem: { id: string; description: string; title?: string }) => {
    // If already evaluated, use existing evaluation
    if (evaluations[problem.id]) {
      onProblemSelect?.({
        id: problem.id,
        subredditName: subreddit,
        title: problem.title,
        description: problem.description,
        evaluation: {
          relevant: evaluations[problem.id].relevant!,
          recommendation: evaluations[problem.id].recommendation!
        }
      });
      return;
    }
    
    // Otherwise, show loading state and start evaluation
    onProblemSelect?.({
      id: problem.id,
      subredditName: subreddit,
      title: problem.title,
      description: problem.description,
      evaluation: undefined // undefined evaluation indicates loading state
    });
    
    // Start the evaluation in the background
    handleEvaluate(problem, false); // Changed to false to allow updating the detail view
  };

  return compact ? (
    // Compact version for when a problem is selected and cards are shown on the left
    <Card className="mb-3 overflow-hidden border border-gray-100 hover-lift bg-white/80 backdrop-blur-sm">
      <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center">
            <div className="mr-2 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <a 
              href={`https://reddit.com/r/${subreddit}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-orange-700 transition-colors"
            >
              r/{subreddit}
            </a>
          </h3>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-xs font-semibold mb-2 flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Common Problems
        </h4>
        <div className="space-y-2">
          {problems.map((problem, index) => {
            const evaluation = evaluations[problem.id];
            const isEvaluating = evaluatingId === problem.id;
            const isSelected = selectedProblem?.id === problem.id && selectedProblem?.subredditName === subreddit;
            
            return (
              <div 
                key={problem.id} 
                className={`p-2 border rounded-lg transition-all duration-300 cursor-pointer ${
                  isEvaluating ? 'border-blue-300 bg-blue-50/50' : 
                  isSelected ? 'border-orange-300 bg-orange-50/50 shadow-md' :
                  evaluation ? (
                    evaluation.relevant ? 'border-green-200 bg-green-50/10' : 'border-red-200 bg-red-50/10'
                  ) : 'border-gray-200 hover:border-orange-200 bg-white'
                }`}
                onClick={() => handleProblemClick(problem)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center bg-orange-100 text-orange-800 rounded-full h-4 w-4 min-w-4 text-xs mr-2">
                      {index + 1}
                    </div>
                    <p className="text-xs font-medium">
                      {problem.title || `Problem ${index + 1}`}
                    </p>
                  </div>
                  
                  {evaluation && (
                    <div className={`inline-flex items-center justify-center h-4 rounded-full text-xs px-1.5 ${
                      evaluation.relevant 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {evaluation.relevant ? 'Relevant' : 'Not Relevant'}
                    </div>
                  )}
                  
                  {isEvaluating && (
                    <div className="flex items-center text-xs text-blue-600">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  ) : (
    // Full version for the main view
    <Card className="mb-6 overflow-hidden border border-gray-100 hover-lift bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <div className="mr-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <a 
              href={`https://reddit.com/r/${subreddit}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-orange-700 transition-colors"
            >
              r/{subreddit}
            </a>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs bg-white border border-gray-200 shadow-sm hover:bg-orange-50"
            onClick={() => window.open(`https://reddit.com/r/${subreddit}`, '_blank')}
          >
            Visit
          </Button>
        </div>
        <CardDescription className="text-sm mt-2 text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Common Problems
        </h3>
        <div className="space-y-3">
          {problems.map((problem, index) => {
            const evaluation = evaluations[problem.id];
            const isEvaluating = evaluatingId === problem.id;
            
            return (
              <div 
                key={problem.id} 
                className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                  isEvaluating ? 'border-blue-300 bg-blue-50/50' : 
                  evaluation ? (
                    evaluation.relevant ? 'border-green-200 bg-green-50/10' : 'border-red-200 bg-red-50/10'
                  ) : 'border-gray-200 hover:border-orange-200 bg-white'
                }`}
                onClick={() => handleProblemClick(problem)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center bg-orange-100 text-orange-800 rounded-full h-5 w-5 min-w-5 text-xs mr-2">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {problem.title || `Problem ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Click to view detailed analysis
                      </p>
                    </div>
                  </div>
                  
                  {evaluation && (
                    <div className={`inline-flex items-center justify-center h-5 rounded-full text-xs px-2 ${
                      evaluation.relevant 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {evaluation.relevant ? 'Relevant' : 'Not Relevant'}
                    </div>
                  )}
                  
                  {isEvaluating && (
                    <div className="flex items-center text-xs text-blue-600">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
