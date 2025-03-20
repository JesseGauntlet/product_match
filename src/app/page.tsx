"use client";

import { useState } from "react";
import ProductForm from "@/components/product-form";
import ProductSummary from "@/components/product-summary";
import SubredditCard from "@/components/subreddit-card";

interface ProductAnalysis {
  product_summary: string;
  target_audience: string;
  problems: string[];
  subreddits: string[];
}

interface SubredditData {
  subreddit: string;
  description: string;
  problems: {
    id: string;
    title?: string;
    description: string;
  }[];
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'analyzing' | 'fetching_subreddits' | 'complete'>('idle');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [subredditData, setSubredditData] = useState<SubredditData[]>([]);

  const handleAnalyzeProduct = async (website: string, description: string) => {
    setIsAnalyzing(true);
    setAnalysisStage('analyzing');
    setAnalysis(null);
    setSubredditData([]);
    
    try {
      // Step 1: Analyze the product
      const analysisResponse = await fetch("/api/analyzeProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, description }),
      });
      
      const analysisData = await analysisResponse.json();
      
      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || "Failed to analyze product");
      }
      
      setAnalysis(analysisData.analysis);
      
      // Step 2: Fetch subreddit data
      if (analysisData.analysis.subreddits && analysisData.analysis.subreddits.length > 0) {
        setAnalysisStage('fetching_subreddits');
        const subredditResponse = await fetch("/api/getSubredditData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subreddits: analysisData.analysis.subreddits }),
        });
        
        const subredditResult = await subredditResponse.json();
        
        if (!subredditResponse.ok) {
          throw new Error(subredditResult.error || "Failed to fetch subreddit data");
        }
        
        setSubredditData(subredditResult.data);
      }
      
      setAnalysisStage('complete');
    } catch (error) {
      console.error("Error in analysis process:", error);
      alert("Error analyzing product. Please check that your URL is correct and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEvaluateProblem = async (
    problem: { id: string; description: string },
    productSummary: string
  ) => {
    try {
      const response = await fetch("/api/evaluateProblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemDescription: problem.description,
          productSummary,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to evaluate problem");
      }
      
      return result.evaluation;
    } catch (error) {
      console.error("Error evaluating problem:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Subreddit Discovery & Product Fit</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find subreddits that align with your product and get recommendations on how to best position your product for each community.
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        {!analysis ? (
          <div className="flex flex-col items-center">
            <ProductForm onSubmit={handleAnalyzeProduct} isLoading={isAnalyzing} />
            
            {isAnalyzing && (
              <div className="mt-8 p-4 bg-muted rounded-md w-full max-w-lg">
                <h3 className="font-medium mb-2">Analysis in Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${analysisStage === 'analyzing' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <p className={analysisStage === 'analyzing' ? 'font-medium' : ''}>
                      {analysisStage === 'analyzing' ? 'Analyzing your product using web search...' : 'Product analysis complete'}
                    </p>
                  </div>
                  
                  {(analysisStage === 'fetching_subreddits' || analysisStage === 'complete') && (
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${analysisStage === 'fetching_subreddits' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <p className={analysisStage === 'fetching_subreddits' ? 'font-medium' : ''}>
                        {analysisStage === 'fetching_subreddits' ? 'Fetching relevant subreddit data...' : 'Subreddit data retrieved'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ProductSummary
                productSummary={analysis.product_summary}
                targetAudience={analysis.target_audience}
                problems={analysis.problems}
                subreddits={analysis.subreddits}
              />
              
              <div className="mb-6">
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setSubredditData([]);
                    setAnalysisStage('idle');
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Start Over
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommended Subreddits</h2>
              {subredditData.length > 0 ? (
                subredditData.map((data) => (
                  <SubredditCard
                    key={data.subreddit}
                    subreddit={data.subreddit}
                    description={data.description}
                    problems={data.problems}
                    productSummary={analysis.product_summary}
                    onEvaluateProblem={handleEvaluateProblem}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">No subreddit data available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}