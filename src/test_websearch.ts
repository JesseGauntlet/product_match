// npx ts-node src/test_websearch.ts
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure this is in your .env file
});
// const website = "https://cubingapp.com"
const description = ""
const website = "https://www.gauntletai.com";
// const description = "Gauntlet is an intensive bootcamp for software engineers, with guaranteed job placement on graduation.";
// const website = "https://www.missouriquiltco.com/"
// const description = ""


async function main() {
  try {
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
              problems_solved: {
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
                description: "List of relevant subreddits (without r/ prefix), where people might discuss problems that this product solves"
              }
            },
            required: ["product_summary", "target_audience", "problems_solved", "subreddits"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    console.log(response.output_text);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();