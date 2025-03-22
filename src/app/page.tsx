"use client";

import { useState } from "react";
import ProductForm from "@/components/product-form";
import ProductSummary from "@/components/product-summary";
import SubredditCard from "@/components/subreddit-card";
import ProblemDetail from "@/components/problem-detail";

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

interface SelectedProblem {
  id: string;
  subredditName: string;
  title?: string;
  description: string;
  evaluation?: {
    relevant: boolean;
    explanation: string;
    recommendation: string;
  };
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'analyzing' | 'fetching_subreddits' | 'complete'>('idle');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [subredditData, setSubredditData] = useState<SubredditData[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<SelectedProblem | null>(null);

  const handleAnalyzeProduct = async (website: string, description: string) => {
    setIsAnalyzing(true);
    setAnalysisStage('analyzing');
    setAnalysis(null);
    setSubredditData([]);
    setSelectedProblem(null);
    
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
    productSummary: string,
    subredditDescription: string
  ) => {
    try {
      const response = await fetch("/api/evaluateProblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemDescription: problem.description,
          productSummary,
          subredditDescription
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

  const handleProblemSelect = (problem: SelectedProblem) => {
    setSelectedProblem(problem);
  };

  const handleCloseProblemDetail = () => {
    setSelectedProblem(null);
  };

  return (
    <div className="min-h-screen">
      {!analysis ? (
        // Landing Page
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-4xl py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Find Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"> Subreddit Match</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform analyzes your product and discovers the most relevant subreddit communities. 
                Get precise matches based on advanced natural language processing and community analysis.
              </p>
            </div>

            {/* Form Section */}
            <div className="mt-12">
              <div className="backdrop-blur-sm bg-white/30 rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/20 p-8">
                <ProductForm onSubmit={handleAnalyzeProduct} isLoading={isAnalyzing} />
                {isAnalyzing && (
                  <div className="mt-8 animate-fade-in">
                    <h3 className="font-semibold mb-4 text-lg">Analysis in Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 rounded-lg transition-all-smooth">
                        <div className={`w-5 h-5 rounded-full mr-3 ${analysisStage === 'analyzing' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <p className={`${analysisStage === 'analyzing' ? 'font-medium text-orange-800' : 'text-green-800'}`}>
                          {analysisStage === 'analyzing' ? 'Analyzing your product using web search...' : 'Product analysis complete'}
                        </p>
                      </div>
                      
                      {(analysisStage === 'fetching_subreddits' || analysisStage === 'complete') && (
                        <div className="flex items-center p-3 rounded-lg transition-all-smooth">
                          <div className={`w-5 h-5 rounded-full mr-3 ${analysisStage === 'fetching_subreddits' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                          <p className={`${analysisStage === 'fetching_subreddits' ? 'font-medium text-orange-800' : 'text-green-800'}`}>
                            {analysisStage === 'fetching_subreddits' ? 'Fetching relevant subreddit data...' : 'Subreddit data retrieved'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="mx-auto mt-24 max-w-4xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    </div>
                    Intelligent Matching
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Advanced algorithms analyze your product&apos;s features and match them with the most relevant subreddit communities.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    Real-time Analysis
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Get instant insights about community engagement patterns and potential reach for your product.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                      </svg>
                    </div>
                    Detailed Analytics
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Comprehensive insights into community demographics, activity patterns, and engagement metrics.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    Safe & Private
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Your data is processed securely and we never store sensitive information about your product.
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Analysis Results Page
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className={`grid transition-all duration-500 ${
              selectedProblem 
                ? 'grid-cols-1 md:grid-cols-[1fr,2fr] gap-8' 
                : 'grid-cols-1 md:grid-cols-2 gap-8'
            }`}>
              <div className={`transition-all duration-500 ${
                selectedProblem ? 'animate-slide-in-left' : 'animate-slide-in-left'
              }`}>
                {!selectedProblem ? (
                  <ProductSummary
                    productSummary={analysis.product_summary}
                    targetAudience={analysis.target_audience}
                    problems={analysis.problems}
                    subreddits={analysis.subreddits}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-600">
                        Recommended Subreddits
                      </h2>
                      <button
                        onClick={handleCloseProblemDetail}
                        className="text-sm text-orange-600 hover:text-orange-800 hover:underline flex items-center transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Summary
                      </button>
                    </div>
                    {subredditData.map((data, index) => (
                      <div key={data.subreddit} className="animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                        <SubredditCard
                          subreddit={data.subreddit}
                          description={data.description}
                          problems={data.problems}
                          productSummary={analysis.product_summary}
                          onEvaluateProblem={handleEvaluateProblem}
                          onProblemSelect={handleProblemSelect}
                          selectedProblem={selectedProblem}
                          compact={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <button
                    onClick={() => {
                      setAnalysis(null);
                      setSubredditData([]);
                      setAnalysisStage('idle');
                      setSelectedProblem(null);
                    }}
                    className="text-sm text-orange-600 hover:text-orange-800 hover:underline flex items-center transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Start Over
                  </button>
                </div>
              </div>
              
              <div className={`transition-all duration-500 ${
                selectedProblem ? 'animate-slide-in-right' : 'animate-slide-in-right'
              }`}>
                {selectedProblem ? (
                  <ProblemDetail
                    problem={selectedProblem}
                    onClose={handleCloseProblemDetail}
                  />
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-600">
                      Recommended Subreddits
                    </h2>
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
                              onProblemSelect={handleProblemSelect}
                              compact={false}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 text-center animate-pulse-subtle">
                        <p className="text-muted-foreground text-lg">Loading subreddit data...</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}