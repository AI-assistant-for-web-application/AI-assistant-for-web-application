import dotenv from "dotenv";
dotenv.config();

import { callGroqAPI, getTokenStats } from "./groq-client.js";

console.log("=== Live Quality Scoring Test ===\n");

async function testLiveQuality() {
  const questions = [
    { q: "What is overfitting?", module: "regression" },
    { q: "Explain gradient descent", module: "regression" },
    { q: "What is precision vs recall?", module: "classification" }
  ];

  for (const { q, module } of questions) {
    console.log(`\nQuestion: "${q}"`);
    console.log(`Module: ${module}`);
    
    const result = await callGroqAPI(q, "CS 229", module);
    
    if (result.success) {
      console.log(`Quality Score: ${result.quality.score}/100`);
      console.log(`Response Time: ${result.responseTime}ms`);
      console.log(`Tokens: ${result.tokens.total}`);
      console.log(`Preview: ${result.message.substring(0, 100)}...`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n=== Final Statistics ===");
  const stats = getTokenStats();
  console.log(`Total Requests: ${stats.requestCount}`);
  console.log(`Average Tokens: ${stats.averageTokensPerRequest}`);
  console.log(`Average Quality: ${stats.averageQualityScore}/100`);
  
  console.log("\n✓ Live test completed!");
}

testLiveQuality().catch(console.error);