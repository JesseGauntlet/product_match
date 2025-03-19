Below is a comprehensive PRD that details every aspect of the application along with code snippets to help another engineer quickly get started.

---

# Product Requirements Document (PRD)

## 1. Overview

The **Subreddit Discovery & Product Fit Application** is a web tool designed to help users (e.g., product marketers or entrepreneurs) discover subreddits that align with their product or service. The application will analyze a user’s website (and an optional description) using OpenAI to:
- Generate a summary of the product.
- Identify the target audience.
- List the problems the product aims to solve.
- Recommend relevant subreddits to target.

For each subreddit, the app will retrieve additional metadata (including description and associated pain points) from Firestore and then use AI to evaluate which subreddit problems are best addressed by the product—with tailored recommendations on framing the product messaging.

---

## 2. Objectives

- **User Input:** Allow users to input their website URL along with an optional description of their product/service.
- **AI Analysis:** Leverage the OpenAI API to analyze the input and return a structured JSON containing the product summary, target audience, identified problems, and a list of relevant subreddits.
- **Data Retrieval:** Query Firestore for additional data (subreddit descriptions and problem details) based on the recommended subreddit names.
- **Problem Evaluation:** For each problem associated with a subreddit, use the OpenAI API to determine product fit and to generate a recommendation on how best to frame the product.
- **Modern UX/UI:** Present the results in a modern, smooth, and highly engaging user interface built with Next.js, Tailwind CSS, and shadcn UI.

---

## 3. Features & Functionality

### User Journey
1. **Input:**  
   - A user visits the home page.
   - Enters their website URL and optionally provides a product description.
2. **Product Analysis:**  
   - The app sends an API request to analyze the product using OpenAI.
   - The response includes a product summary, target audience, a list of problems, and a list of relevant subreddits.
3. **Data Aggregation:**  
   - For each recommended subreddit, the backend queries Firestore to fetch the subreddit’s details (description, problems, etc.).
4. **Problem Relevance:**  
   - For each problem found under a subreddit, the backend makes an AI call to evaluate whether the product addresses the pain point and how to position it.
5. **Result Presentation:**  
   - The user is shown a modern, responsive interface displaying:
     - A summary of their product analysis.
     - A list of subreddits with descriptions.
     - Highlighted problems with tailored product messaging recommendations.

### Key Features
- **Input Form:** A simple and elegant form for entering the website and optional description.
- **AI Integration:** Two distinct AI calls:
  - One for analyzing the product.
  - Another for evaluating each problem’s relevance.
- **Firestore Integration:** Efficient queries to retrieve subreddit details from a pre-defined schema.
- **Responsive UI:** Built with Tailwind CSS and shadcn UI, ensuring a smooth experience on all devices.
- **Feedback & Loading States:** Visual feedback during API calls and clear error messages when needed.

---

## 4. System Architecture

### Frontend
- **Framework:** Next.js with TypeScript.
- **Styling:** Tailwind CSS combined with shadcn UI components for a modern look.
- **Pages/Components:**
  - **Home Page:** Input form and results display.
  - **Results Page/Component:** Detailed view of the analysis, subreddit data, and recommendations.

### Backend / API
- **API Routes:** Next.js API routes to handle:
  - Product analysis (`/api/analyzeProduct`).
  - Subreddit data retrieval (`/api/getSubredditData`).
  - Problem evaluation (`/api/evaluateProblem`).
- **OpenAI Integration:** Use OpenAI’s API (with search enabled) to generate the necessary analyses.
- **Firestore:** Retrieve data using the provided Firestore schema which is organized by subreddits.

### Data Storage (Firestore Schema)
The Firestore is organized as follows:

```
subreddits (collection)
  └── {subreddit_name} (document)
         ├── name, analysis_date, submissions_analyzed, etc.
         ├── description (Extracted from Primary Characteristics)
         ├── metadata (sub-collection)
         │     └── combined_text (document)
         ├── problems (sub-collection)
         │     ├── problem_1 (document: title, description, etc.)
         │     └── ...
         └── analyses (sub-collection)
               ├── submissions (document with meta_analysis, all_analyses, etc.)
               └── ...
```

---

## 5. API Endpoints & Workflow

### 5.1 Analyze Product API

- **Endpoint:** `/api/analyzeProduct`
- **Method:** POST
- **Input:**  
  ```json
  {
    "website": "https://yourwebsite.com",
    "description": "Optional product description"
  }
  ```
- **Process:**  
  - Validate input.
  - Construct a prompt to query OpenAI (e.g., “Analyze the product with website ...”).
  - Parse the JSON response containing `product_summary`, `target_audience`, `problems`, and `subreddits`.
- **Output:** JSON with the analysis details.

**Code Example:**

```typescript
// pages/api/analyzeProduct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website, description } = req.body;
  if (!website) {
    return res.status(400).json({ error: 'Website is required' });
  }

  try {
    const prompt = `Analyze the product with website ${website} and description ${description || ''}. Return a JSON with keys: product_summary, target_audience, problems, and subreddits (an array of subreddit names).`;
    
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
    });

    const result = response.data.choices[0].text;
    const analysis = JSON.parse(result || '{}'); // Add robust error handling as needed

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to analyze product' });
  }
}
```

---

### 5.2 Get Subreddit Data API

- **Endpoint:** `/api/getSubredditData`
- **Method:** POST
- **Input:**  
  ```json
  {
    "subreddits": ["subreddit1", "subreddit2"]
  }
  ```
- **Process:**  
  - Validate the subreddit list.
  - For each subreddit, query Firestore to fetch document data.
- **Output:** JSON containing an array of subreddit data.

**Code Example:**

```typescript
// pages/api/getSubredditData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import firestore from '../../lib/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { subreddits } = req.body;
  if (!subreddits || !Array.isArray(subreddits)) {
    return res.status(400).json({ error: 'Subreddits array is required' });
  }

  try {
    const results = await Promise.all(subreddits.map(async (subreddit: string) => {
      const doc = await firestore.collection('subreddits').doc(subreddit).get();
      if (!doc.exists) return null;
      return { subreddit, ...doc.data() };
    }));

    return res.status(200).json({ data: results.filter(Boolean) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve subreddit data' });
  }
}
```

*Firestore Initialization (shared library):*

```typescript
// lib/firestore.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = getFirestore();
export default firestore;
```

---

### 5.3 Evaluate Problem API

- **Endpoint:** `/api/evaluateProblem`
- **Method:** POST
- **Input:**  
  ```json
  {
    "productSummary": "Summary of the product...",
    "problemDescription": "Description of the subreddit problem..."
  }
  ```
- **Process:**  
  - Validate input.
  - Construct a prompt to query OpenAI (e.g., “Given the product description... determine relevance…”).
  - Parse the JSON response containing `relevant` (boolean) and `recommendation` (string).
- **Output:** JSON with the evaluation.

**Code Example:**

```typescript
// pages/api/evaluateProblem.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { productSummary, problemDescription } = req.body;
  if (!productSummary || !problemDescription) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const prompt = `Given the product description: "${productSummary}" and the following problem: "${problemDescription}", determine if the product is relevant to solving this problem, and if so, suggest the best way to frame the product to address this pain point. Return a JSON with keys: relevant (boolean) and recommendation (string).`;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 250,
    });

    const result = response.data.choices[0].text;
    const evaluation = JSON.parse(result || '{}');

    return res.status(200).json({ evaluation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to evaluate problem' });
  }
}
```

---

## 6. UI/UX Considerations

### Modern & Smooth Interface
- **Design:**  
  - Clean typography with a spacious layout.
  - Consistent use of Tailwind CSS and shadcn UI components.
- **Responsiveness:**  
  - Mobile-first design.
  - A two-column layout on desktops: one for the product summary and one for detailed subreddit analysis.
- **Animations & Feedback:**  
  - Smooth transitions (e.g., fade-ins and slide-ins) when displaying results.
  - Loading spinners or skeleton screens while data is being fetched.
- **Error Handling:**  
  - Clear messaging for input validation and API errors.
  - User-friendly prompts to correct any issues.

### Example Next.js Page
Below is an example page that includes the input form and displays the analysis results.

```typescript
// pages/index.tsx
import { useState } from 'react';

export default function Home() {
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    const res = await fetch('/api/analyzeProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ website, description }),
    });
    const data = await res.json();
    setResults(data.analysis);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Find Your Relevant Subreddits</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">Website</label>
          <input
            id="website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product or service"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {loading ? 'Analyzing...' : 'Analyze Product'}
        </button>
      </form>
      {results && (
        <div className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 7. Non-functional Requirements

- **Performance:**  
  - API responses should be delivered in under 2 seconds under normal conditions.
- **Scalability:**  
  - The system should be scalable through Next.js and Firestore’s managed services.
- **Security:**  
  - Secure API keys using environment variables.
  - Ensure data validation on both client and server sides.
- **Maintainability:**  
  - Use TypeScript for type safety.
  - Write clear, well-documented code and maintain consistent coding standards.

---

## 8. Future Enhancements

- **User Authentication:**  
  - Integrate user accounts for saving past analyses.
- **Dashboard & Analytics:**  
  - Provide a dashboard for users to monitor and compare analyses over time.
- **Enhanced AI Prompts:**  
  - Iteratively improve the prompts used for OpenAI calls based on user feedback and results.
- **UI Polish:**  
  - Implement additional animations and micro-interactions to further enhance the user experience.
