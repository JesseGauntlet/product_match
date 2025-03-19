import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductSummaryProps {
  productSummary: string;
  targetAudience: string;
  problems: string[];
}

export default function ProductSummary({
  productSummary,
  targetAudience,
  problems
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
      </CardContent>
    </Card>
  );
}
