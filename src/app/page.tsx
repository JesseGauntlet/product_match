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
      <header className="mb-12 text-center animate-slide-down">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          Subreddit Discovery & Product Fit
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Find subreddits that align with your product and get recommendations on how to best position your product for each community.
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        {!analysis ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 hover-lift transition-all-smooth">
              <ProductForm onSubmit={handleAnalyzeProduct} isLoading={isAnalyzing} />
            </div>
            
            {isAnalyzing && (
              <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-lg border border-gray-100 animate-slide-up">
                <h3 className="font-semibold mb-4 text-lg">Analysis in Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg transition-all-smooth">
                    <div className={`w-5 h-5 rounded-full mr-3 ${analysisStage === 'analyzing' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <p className={`${analysisStage === 'analyzing' ? 'font-medium text-blue-800' : 'text-green-800'}`}>
                      {analysisStage === 'analyzing' ? 'Analyzing your product using web search...' : 'Product analysis complete'}
                    </p>
                  </div>
                  
                  {(analysisStage === 'fetching_subreddits' || analysisStage === 'complete') && (
                    <div className="flex items-center p-3 rounded-lg transition-all-smooth">
                      <div className={`w-5 h-5 rounded-full mr-3 ${analysisStage === 'fetching_subreddits' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <p className={`${analysisStage === 'fetching_subreddits' ? 'font-medium text-blue-800' : 'text-green-800'}`}>
                        {analysisStage === 'fetching_subreddits' ? 'Fetching relevant subreddit data...' : 'Subreddit data retrieved'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-slide-in-left">
              <ProductSummary
                productSummary={analysis.product_summary}
                targetAudience={analysis.target_audience}
                problems={analysis.problems}
                subreddits={analysis.subreddits}
              />
              
              <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setSubredditData([]);
                    setAnalysisStage('idle');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Start Over
                </button>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Recommended Subreddits</h2>
              {subredditData.length > 0 ? (
                <div className="space-y-4">
                  {subredditData.map((data, index) => (
                    <div key={data.subreddit} className="animate-fade-in" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                      <SubredditCard
                        subreddit={data.subreddit}
                        description={data.description}
                        problems={data.problems}
                        productSummary={analysis.product_summary}
                        onEvaluateProblem={handleEvaluateProblem}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 text-center animate-pulse-subtle">
                  <p className="text-muted-foreground text-lg">Loading subreddit data...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}