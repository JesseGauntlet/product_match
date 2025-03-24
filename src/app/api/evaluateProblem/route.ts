import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productSummary, problemDescription, subredditDescription } = body;

    if (!productSummary || !problemDescription) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const prompt = `Analyze the relevance of a product to a specific problem in a subreddit community.

Context:
- Product Description: "${productSummary}"
- Problem Description: "${problemDescription}"
- Subreddit Community Context: "${subredditDescription || 'No description available'}"

Task:
1. Evaluate if the product could help solve this specific problem
2. Consider the subreddit's context and community focus
3. If relevant, explain how the product could be positioned to address this pain point

Return a JSON object with the following keys:
- relevant (boolean): Whether the product is genuinely relevant to solving this problem
- explanation (string): A clear explanation of why the product is or isn't relevant to this specific problem and community
- recommendation (string): If relevant, specific suggestions for how to frame the product as a solution to this problem

Important: Be discerning and only mark as relevant if there's a strong, direct connection between the product and the problem in the context of this specific community.`;

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
    const evaluation = JSON.parse(result || '{}');

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating problem:', error);
    return NextResponse.json({ error: 'Failed to evaluate problem' }, { status: 500 });
  }
}
