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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Product Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Summary</h3>
          <p className="text-sm">{productSummary}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Target Audience</h3>
          <p className="text-sm">{targetAudience}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Problems Solved</h3>
          <ul className="list-disc pl-5 text-sm">
            {problems.map((problem, i) => (
              <li key={i}>{problem}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-1">Identified Subreddits</h3>
          <ul className="list-disc pl-5 text-sm">
            {subreddits.map((subreddit, i) => (
              <li key={i}>
                <a 
                  href={`https://reddit.com/r/${subreddit}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  r/{subreddit}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
