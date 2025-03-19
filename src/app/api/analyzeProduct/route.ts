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

    const prompt = `Analyze the product with website ${website} ${description ? `and description: ${description}` : ''}. 
    Search the web for information about this product and its features.
    Return a JSON with the following structure:
    {
      "product_summary": "A concise summary of the product based on the website and web search results",
      "target_audience": "The target audience for this product",
      "problems": ["Problem 1", "Problem 2", ...],
      "subreddits": ["subreddit1", "subreddit2", ...]
    }
    Be sure to identify relevant subreddits where people might discuss problems that this product solves.
    Include at least 3-5 subreddits that would be most relevant for this product.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: prompt
      }],
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search the web for information about the product",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query"
                }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "auto",
      response_format: { type: "json_object" }
    });

    // Extract the response content
    const responseMessage = response.choices[0].message;
    let result = responseMessage.content;

    // If there are tool calls, process them
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      // Handle each tool call
      const toolCalls = responseMessage.tool_calls;
      const webSearchCalls = toolCalls.filter(call => 
        call.function.name === "web_search"
      );

      if (webSearchCalls.length > 0) {
        // Collect all search results
        const searchResults = await Promise.all(
          webSearchCalls.map(async (call) => {
            const args = JSON.parse(call.function.arguments);
            // In a real implementation, this would call an actual web search API
            // For now, we'll simulate a web search by querying OpenAI with web searching ability
            const searchResponse = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "user",
                  content: `Please search the web for: ${args.query} and provide a summary of relevant information.`
                }
              ]
            });
            
            return {
              tool_call_id: call.id,
              role: "tool" as const,
              content: searchResponse.choices[0].message.content || ""
            };
          })
        );

        // Send the search results back to OpenAI for final analysis
        const finalResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt
            },
            responseMessage,
            ...searchResults
          ],
          response_format: { type: "json_object" }
        });

        result = finalResponse.choices[0].message.content;
      }
    }

    const analysis = JSON.parse(result || '{}');

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing product:', error);
    return NextResponse.json({ error: 'Failed to analyze product' }, { status: 500 });
  }
}
