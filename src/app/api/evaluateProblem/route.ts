import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productSummary, problemDescription } = body;

    if (!productSummary || !problemDescription) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const prompt = `Given the product description: "${productSummary}" and the following problem: "${problemDescription}", determine if the product is relevant to solving this problem, and if so, suggest the best way to frame the product to address this pain point. Return a JSON with keys: relevant (boolean) and recommendation (string).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    const evaluation = JSON.parse(result || '{}');

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating problem:', error);
    return NextResponse.json({ error: 'Failed to evaluate problem' }, { status: 500 });
  }
}
