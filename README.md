# Subreddit Discovery & Product Fit

A powerful web application that helps product marketers and entrepreneurs discover relevant subreddits for their products and receive tailored messaging recommendations.

## Overview

This application analyzes your product website (and optional description) using OpenAI's advanced AI models with web search capabilities to:

- Generate a comprehensive product summary
- Identify your target audience
- List the problems your product aims to solve
- Recommend relevant subreddits that align with your product
- Provide tailored messaging recommendations for each community

For each recommended subreddit, the app retrieves additional metadata (including description and common pain points) from Firestore and uses AI to evaluate which subreddit problems are best addressed by your product—with tailored recommendations on how to frame your messaging.

## Features

- **AI-Powered Analysis**: Leverages OpenAI with web search functionality to analyze your product and find the most relevant subreddits
- **Real-time Progress Updates**: Visual indicators show the analysis progress at each stage
- **Subreddit Data Integration**: Pulls detailed information about each recommended subreddit from Firestore
- **Problem-Solution Matching**: Evaluates how well your product addresses specific pain points in each community
- **Modern, Responsive UI**: Built with Next.js, Tailwind CSS, and shadcn UI for a seamless experience on all devices

## Getting Started

### Prerequisites

Before running the application, you need to set up:

1. An OpenAI API key (with GPT-4 access)
2. A Firestore database with subreddit data (see Firestore Setup below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product_match
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here

# Option 1: Use Google Application Credentials (recommended)
GOOGLE_APPLICATION_CREDENTIALS="../firestore_key.json"
FIRESTORE_PROJECT_ID="your_project_id"

# Option 2: Or use individual Firebase credentials
# FIREBASE_PROJECT_ID=your_firebase_project_id
# FIREBASE_CLIENT_EMAIL=your_firebase_client_email
# FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter your product website URL in the form
2. Optionally add a product description for more accurate results
3. Click "Analyze Product"
4. The system will analyze your product using web search and display:
   - A summary of your product
   - Your target audience
   - Problems your product solves
   - Recommended subreddits with descriptions
   - Tailored messaging suggestions for each community

## Firestore Setup

The application expects a specific Firestore schema:

```
subreddits (collection)
  └── {subreddit_name} (document)
         ├── description (string)
         └── problems (subcollection)
              └── {problem_id} (document)
                   ├── title (optional string)
                   └── description (string)
```

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn UI
- **Backend**: Next.js API routes
- **Database**: Firebase Firestore
- **AI**: OpenAI API with GPT-4o model and web search capability

## Architecture

The application follows a simple flow:

1. **Product Analysis**: The application analyzes your product using OpenAI with web search
2. **Subreddit Discovery**: Based on the analysis, it identifies relevant subreddits
3. **Data Aggregation**: For each subreddit, it retrieves data from Firestore
4. **Problem Evaluation**: The app evaluates how well your product addresses each problem
5. **Results Presentation**: All information is presented in a clean, user-friendly interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project uses the OpenAI API for AI-powered analysis
- UI components provided by shadcn UI and styled with Tailwind CSS
- Built with Next.js and TypeScript for a modern, type-safe application
