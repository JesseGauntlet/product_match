import { NextResponse } from 'next/server';
import firestore from '@/lib/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subreddits } = body;

    if (!subreddits || !Array.isArray(subreddits)) {
      return NextResponse.json({ error: 'Subreddits array is required' }, { status: 400 });
    }

    const results = await Promise.all(subreddits.map(async (subreddit: string) => {
      // Get main subreddit document
      const doc = await firestore.collection('subreddits').doc(subreddit).get();
      if (!doc.exists) return null;
      
      const subredditData = doc.data();
      
      // Get problems subcollection
      const problemsSnapshot = await firestore
        .collection('subreddits')
        .doc(subreddit)
        .collection('problems')
        .get();
      
      const problems = problemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { 
        subreddit, 
        description: subredditData?.description || '',
        problems 
      };
    }));

    return NextResponse.json({ data: results.filter(Boolean) });
  } catch (error) {
    console.error('Error getting subreddit data:', error);
    return NextResponse.json({ error: 'Failed to retrieve subreddit data' }, { status: 500 });
  }
}
