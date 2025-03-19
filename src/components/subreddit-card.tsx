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
    } catch (error) {
      console.error('Error evaluating problem:', error);
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">r/{subreddit}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-3">Common Problems:</h3>
        <div className="space-y-4">
          {problems.map((problem) => {
            const evaluation = evaluations[problem.id];
            return (
              <div key={problem.id} className="p-3 border rounded-md">
                <p className="font-medium text-sm mb-2">{problem.title || 'Problem'}</p>
                <p className="text-sm mb-3">{problem.description}</p>
                
                {!evaluation ? (
                  <Button 
                    size="sm"
                    variant="outline"
                    disabled={evaluatingId === problem.id}
                    onClick={() => handleEvaluate(problem)}
                  >
                    {evaluatingId === problem.id ? 'Evaluating...' : 'Evaluate Fit'}
                  </Button>
                ) : (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="font-semibold mb-1">
                      {evaluation.relevant 
                        ? '✅ Your product is relevant' 
                        : '❌ Your product may not be relevant'}
                    </p>
                    {evaluation.recommendation && (
                      <p className="text-sm">{evaluation.recommendation}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
