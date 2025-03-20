import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductSummaryProps {
  productSummary: string;
  targetAudience: string;
  problems: string[];
  subreddits: string[];
}

export default function ProductSummary({
  productSummary,
  targetAudience,
  problems,
  subreddits
}: ProductSummaryProps) {
  return (
    <Card className="mb-6 overflow-hidden border border-gray-100 hover-lift bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <CardTitle className="flex items-center text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Product Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="transition-all duration-200 hover:bg-blue-50/50 p-3 rounded-lg animate-fade-in">
          <h3 className="text-sm font-semibold mb-2 flex items-center text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Summary
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{productSummary}</p>
        </div>
        
        <div className="transition-all duration-200 hover:bg-blue-50/50 p-3 rounded-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-semibold mb-2 flex items-center text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Target Audience
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{targetAudience}</p>
        </div>
        
        <div className="transition-all duration-200 hover:bg-blue-50/50 p-3 rounded-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-semibold mb-2 flex items-center text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Problems Solved
          </h3>
          <ul className="list-none pl-1 text-sm space-y-2">
            {problems.map((problem, i) => (
              <li key={i} className="flex items-start">
                <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-5 w-5 min-w-5 text-xs mr-2 mt-0.5">{i + 1}</span>
                <span className="text-gray-700">{problem}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="transition-all duration-200 hover:bg-blue-50/50 p-3 rounded-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold mb-2 flex items-center text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Identified Subreddits
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {subreddits.map((subreddit, i) => (
              <a 
                key={i}
                href={`https://reddit.com/r/${subreddit}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-2 bg-white rounded-md border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-6 h-6 mr-2 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-medium">r/{subreddit}</span>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
