import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subreddits, productSummary, targetAudience } = body;

    if (!subreddits || !Array.isArray(subreddits) || !productSummary) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Create a subreddit evaluation prompt
    const prompt = `
You are evaluating the relevance of subreddits for a product.

Product Summary: "${productSummary}"
Target Audience: "${targetAudience || 'Not specified'}"

Evaluate each of the following subreddits for their relevance to this product and its target audience:
${subreddits.map(s => `- ${s.name || s}: ${s.description || 'No description available'}`).join('\n')}

Return a JSON array containing ONLY the subreddit names (without the r/ prefix) that are genuinely relevant to the product. 
Include no more than 10 subreddits, prioritizing those that are most relevant.

Only include subreddits where:
1. The product would provide real value to the community members
2. The subreddit's focus aligns well with the product's purpose
3. Community members would be receptive to the product

IMPORTANT: Do not include subreddits just because they are broadly related to the general topic. 
They must be specifically relevant to this particular product.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const result = response.choices[0].message.content;
    const evaluationData = JSON.parse(result || '{}');

    // Ensure the response has the expected format
    if (!evaluationData.subreddits || !Array.isArray(evaluationData.subreddits)) {
      return NextResponse.json({ 
        error: 'Invalid response from evaluation' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      relevantSubreddits: evaluationData.subreddits 
    });
  } catch (error) {
    console.error('Error evaluating subreddits:', error);
    return NextResponse.json({ error: 'Failed to evaluate subreddits' }, { status: 500 });
  }
} 