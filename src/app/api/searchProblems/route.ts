import { NextResponse } from 'next/server';
import { searchProblems } from '@/lib/vectorSearch';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Search for problems using vector search
    const searchResults = await searchProblems(query);

    // Format the results
    const formattedResults = searchResults.map(result => ({
      id: result.id,
      similarity: result.similarity,
      subreddit: result.data.subreddit,
      title: result.data.title || 'Untitled Problem',
      description: result.data.description || 'No description available'
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error('Error searching problems:', error);
    return NextResponse.json({ error: 'Failed to search problems' }, { status: 500 });
  }
} 