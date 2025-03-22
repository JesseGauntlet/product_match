import firestore from './firestore';
import { generateEmbedding } from './embeddings';

interface SubredditData {
  description?: string;
}

interface ProblemData {
  [key: string]: unknown;
}

interface SearchResult<T> {
  id: string;
  similarity: number;
  data: T;
}

/**
 * Search for similar subreddits based on a query using vector search
 * @param query The search query text
 * @param limit Maximum number of results to return
 * @returns Array of subreddit search results sorted by similarity
 */
export async function searchSubreddits(query: string, limit: number = 10): Promise<SearchResult<SubredditData>[]> {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Execute the vector search using find_nearest()
    const subredditsCollection = firestore.collection('subreddits');
    const vectorQuery = subredditsCollection.findNearest({
      vectorField: "description_embedding",
      queryVector: queryEmbedding,
      distanceMeasure: "COSINE",
      limit: limit,
      distanceResultField: "vector_distance"
    });
    
    // Get results
    const results = await vectorQuery.get();
    
    if (results.empty) {
      console.log('No vector search results found');
      return [];
    }
    
    // Format results
    const formattedResults: SearchResult<SubredditData>[] = [];
    
    results.docs.forEach(doc => {
      const data = doc.data() as SubredditData & { vector_distance?: number };
      const distance = data.vector_distance ?? 0;
      // Convert cosine distance to similarity score (0-1 range)
      const similarity = 1 - (distance / 2);
      
      formattedResults.push({
        id: doc.id,
        similarity: similarity,
        data: data
      });
    });
    
    return formattedResults;
  } catch (error) {
    console.error('Error during subreddit vector search:', error);
    return [];
  }
}

/**
 * Search for similar problems across all subreddits
 * @param query The search query text
 * @param limit Maximum number of results to return
 * @returns Array of problem search results sorted by similarity
 */
export async function searchProblems(query: string, limit: number = 10): Promise<SearchResult<ProblemData>[]> {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Execute the vector search using find_nearest() on collection group
    const problemsCollectionGroup = firestore.collectionGroup('problems');
    const vectorQuery = problemsCollectionGroup.findNearest({
      vectorField: "embedding",
      queryVector: queryEmbedding,
      distanceMeasure: "COSINE",
      limit: limit,
      distanceResultField: "vector_distance"
    });
    
    // Get results
    const results = await vectorQuery.get();
    
    if (results.empty) {
      console.log('No vector search results found');
      return [];
    }
    
    // Format results
    const formattedResults: SearchResult<ProblemData>[] = [];
    
    results.docs.forEach(doc => {
      const data = doc.data() as ProblemData & { vector_distance?: number };
      const distance = data.vector_distance ?? 0;
      // Convert cosine distance to similarity score (0-1 range)
      const similarity = 1 - (distance / 2);
      
      // Get the subreddit name from the reference path
      const subreddit = doc.ref.parent.parent?.id || 'unknown';
      
      formattedResults.push({
        id: doc.id,
        similarity: similarity,
        data: {
          ...data,
          subreddit: subreddit
        }
      });
    });
    
    return formattedResults;
  } catch (error) {
    console.error('Error during problem vector search:', error);
    return [];
  }
} 