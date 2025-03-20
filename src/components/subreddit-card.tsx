"use client";

import { useState } from 'react';
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
}

export default function SubredditCard({
  subreddit,
  description,
  problems,
  productSummary,
  onEvaluateProblem
}: SubredditCardProps) {
  const [evaluations, setEvaluations] = useState<Record<string, ProblemEvaluation>>({});
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleEvaluate = async (problem: { id: string; description: string }) => {
    setEvaluatingId(problem.id);
    try {
      const result = await onEvaluateProblem(problem, productSummary);
      setEvaluations(prev => ({
        ...prev,
        [problem.id]: {
          ...problem,
          relevant: result.relevant,
          recommendation: result.recommendation
        }
      }));
      // Auto-expand the evaluated problem
      setExpanded(prev => ({
        ...prev,
        [problem.id]: true
      }));
    } catch (error) {
      console.error('Error evaluating problem:', error);
    } finally {
      setEvaluatingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
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
            const isExpanded = expanded[problem.id];
            return (
              <div 
                key={problem.id} 
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  evaluatingId === problem.id ? 'border-blue-300 bg-blue-50/50' : 
                  evaluation ? (
                    evaluation.relevant ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
                  ) : 'border-gray-200 hover:border-orange-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => toggleExpand(problem.id)}
                  >
                    <div className={`mr-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="inline-flex items-center justify-center bg-orange-100 text-orange-800 rounded-full h-5 w-5 min-w-5 text-xs mr-2">
                      {index + 1}
                    </div>
                    <p className="font-medium text-sm">
                      {problem.title || `Problem ${index + 1}`}
                    </p>
                  </div>
                  
                  {!evaluation && (
                    <Button 
                      size="sm"
                      variant="outline"
                      disabled={evaluatingId === problem.id}
                      onClick={() => handleEvaluate(problem)}
                      className="text-xs h-8 bg-white border-gray-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                    >
                      {evaluatingId === problem.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : 'Evaluate Fit'}
                    </Button>
                  )}
                </div>
                
                <div className={`mt-2 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm mb-3 text-gray-700 pl-7">{problem.description}</p>
                  
                  {evaluation && (
                    <div className="mt-3 p-4 rounded-md animate-fade-in bg-white shadow-sm border">
                      <p className={`font-semibold mb-2 flex items-center ${evaluation.relevant ? 'text-green-700' : 'text-red-700'}`}>
                        {evaluation.relevant ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Your product addresses this problem
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Your product may not be relevant
                          </>
                        )}
                      </p>
                      {evaluation.recommendation && (
                        <div className="text-sm bg-gray-50 p-3 rounded border border-gray-100 text-gray-700">
                          <p className="font-medium mb-1">Recommendation:</p>
                          <p>{evaluation.recommendation}</p>
                        </div>
                      )}
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
