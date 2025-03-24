import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchSubreddits } from '@/lib/vectorSearch';

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not found in environment');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { website, description } = body;

    if (!website) {
      return NextResponse.json({ error: 'Website is required' }, { status: 400 });
    }

    // Step 1: Perform initial analysis with GPT-4o
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: `Analyze the product with website ${website} and description: ${description}
Search the web for information about this product and its features by first visiting the website site:${website}`,
      tools: [{
        type: "web_search_preview",
        search_context_size: "medium",
      }],
      temperature: 0.1,
      text: {
        format: {
          type: "json_schema",
          name: "product_analysis",
          schema: {
            type: "object",
            properties: {
              product_summary: {
                type: "string",
                description: "A concise 5 sentence summary of the product based on the website and web search results"
              },
              target_audience: {
                type: "string",
                description: "2 sentence summary of the target audience for this product"
              },
              problems: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of problems the product solves"
              },
              subreddits: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of relevant subreddits (without r/ prefix), ordered by relevance"
              }
            },
            required: ["product_summary", "target_audience", "problems", "subreddits"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const initialAnalysis = JSON.parse(response.output_text);
    
    // Step 2: Perform vector search using the product summary and target audience
    const searchQuery = `${initialAnalysis.product_summary} ${initialAnalysis.target_audience}`;
    const vectorSearchResults = await searchSubreddits(searchQuery, 10);
    
    // Step 3: Evaluate the combined list of subreddits
    const allSubreddits = [
      ...initialAnalysis.subreddits.map((name: string) => ({ name, source: 'ai' })),
      ...vectorSearchResults.map(result => ({ 
        name: result.id, 
        description: result.data.description,
        source: 'vector',
        similarity: result.similarity
      }))
    ];
    
    // Remove duplicates
    const uniqueSubreddits = Array.from(
      new Map(allSubreddits.map(item => [item.name, item])).values()
    );
    
    // Evaluate relevance with GPT-4o
    const evaluationResponse = await fetch(new URL('/api/evaluateSubreddits', req.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subreddits: uniqueSubreddits,
        productSummary: initialAnalysis.product_summary,
        targetAudience: initialAnalysis.target_audience
      }),
    });
    
    const evaluationData = await evaluationResponse.json();
    
    if (!evaluationResponse.ok) {
      console.error('Subreddit evaluation failed:', evaluationData.error);
      // Fall back to original subreddits if evaluation fails
      return NextResponse.json({ analysis: initialAnalysis });
    }
    
    // Step 4: Return the refined analysis with the evaluated subreddits
    const refinedAnalysis = {
      ...initialAnalysis,
      subreddits: evaluationData.relevantSubreddits
    };
    
    return NextResponse.json({ analysis: refinedAnalysis });
  } catch (error) {
    console.error('Error analyzing product:', error);
    return NextResponse.json({ error: 'Failed to analyze product' }, { status: 500 });
  }
}
