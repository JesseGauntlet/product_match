import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProblemDetailProps {
  problem: {
    id: string;
    subredditName: string;
    title?: string;
    description: string;
    evaluation?: {
      relevant: boolean;
      explanation: string;
      recommendation: string;
    };
  };
  onClose: () => void;
}

export default function ProblemDetail({ problem, onClose }: ProblemDetailProps) {
  const hasEvaluation = problem.evaluation !== undefined;
  const isRelevant = hasEvaluation && problem.evaluation?.relevant === true;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Problem Analysis
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </Button>
      </div>

      <Card className="overflow-hidden border border-gray-100 shadow-lg animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center">
            <div className="mr-3 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl">
                {problem.title || `Problem from r/${problem.subredditName}`}
              </CardTitle>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <a 
                  href={`https://reddit.com/r/${problem.subredditName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  r/{problem.subredditName}
                </a>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Problem Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{problem.description}</p>
          </div>
          
          {hasEvaluation ? (
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Product Relevance
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isRelevant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isRelevant ? 'Relevant' : 'Not Relevant'}
                </div>
              </div>
              
              <div className={`p-4 rounded-md shadow-sm border ${
                isRelevant ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {isRelevant ? (
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div>
                    <h4 className={`font-medium text-sm ${isRelevant ? 'text-green-700' : 'text-red-700'}`}>
                      {isRelevant 
                        ? 'Your product addresses this problem' 
                        : 'Your product may not be relevant to this problem'
                      }
                    </h4>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {problem.evaluation?.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Product Relevance
                </h3>
              </div>
              
              <div className="p-4 rounded-md shadow-sm border border-blue-200 bg-blue-50/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-blue-700">
                      Analyzing problem relevance...
                    </h4>
                    <p className="text-xs text-blue-600 mt-1">
                      This may take a few seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasEvaluation ? (
            problem.evaluation?.recommendation && (
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recommendation
                </h3>
                <div className="text-gray-700 bg-blue-50/50 p-4 rounded-md border border-blue-100 whitespace-normal break-words leading-relaxed">
                  {problem.evaluation?.recommendation}
                </div>
              </div>
            )
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recommendation
              </h3>
              <div className="text-gray-700 bg-blue-50/50 p-4 rounded-md border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-blue-700">
                    Generating recommendations...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Action Items
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative top-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 text-gray-700">
                  {isRelevant 
                    ? "Highlight how your product addresses this specific pain point when posting to r/" + problem.subredditName
                    : "Consider if your product roadmap could address this pain point in the future"
                  }
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative top-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 text-gray-700">
                  {isRelevant 
                    ? "Use terminology from the subreddit when describing how your product solves this problem"
                    : "Focus on other problems your product does solve when engaging with this community"
                  }
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 