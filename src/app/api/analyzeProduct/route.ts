import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    const response = await openai.responses.create({
      model: "gpt-4o",
      input: `Analyze the product with website ${website} and description: ${description}
Search the web for information about this product and its features, e.g. site:${website}`,
      tools: [{
        type: "web_search_preview",
        search_context_size: "medium",
      }],
      text: {
        format: {
          type: "json_schema",
          name: "product_analysis",
          schema: {
            type: "object",
            properties: {
              product_summary: {
                type: "string",
                description: "A concise summary of the product based on the website and web search results"
              },
              target_audience: {
                type: "string",
                description: "The target audience for this product"
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

    const analysis = JSON.parse(response.output_text);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing product:', error);
    return NextResponse.json({ error: 'Failed to analyze product' }, { status: 500 });
  }
}
