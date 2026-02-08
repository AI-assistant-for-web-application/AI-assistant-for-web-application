import dotenv from "dotenv";
import { callGroqAPI, getTokenStats, resetTokenStats } from "./groq-client.js";

// Load and show debug info
const envResult = dotenv.config();
console.log("Dotenv loaded:", envResult.error ? "FAILED - " + envResult.error : "SUCCESS");
console.log("GROQ_API_KEY exists:", process.env.GROQ_API_KEY ? "YES" : "NO");
if (process.env.GROQ_API_KEY) {
  console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY.length, "characters");
}
console.log("");

console.log("-- Token Tracking Test --\n");

async function testTokenTracking() {
  // Reset stats before test
  resetTokenStats();
  console.log("Initial token stats:", getTokenStats());
  console.log("");

  // Make first request
  console.log("--- Request 1 ---");
  const result1 = await callGroqAPI("What is machine learning?");
  if (result1.success) {
    console.log("Response received");
    console.log("Tokens used:", result1.tokens);
    console.log("Current stats:", result1.stats);
    console.log("");
  } else {
    console.log("Error:", result1.error);
    console.log("");
  }

  // Make second request
  console.log("--- Request 2 ---");
  const result2 = await callGroqAPI("Explain linear regression");
  if (result2.success) {
    console.log("Response received");
    console.log("Tokens used:", result2.tokens);
    console.log("Current stats:", result2.stats);
    console.log("");
  } else {
    console.log("Error:", result2.error);
    console.log("");
  }

  // Check final stats
  console.log("--- Final Statistics ---");
  const finalStats = getTokenStats();
  console.log("Total requests:", finalStats.requestCount);
  console.log("Total tokens:", finalStats.totalTokens);
  console.log("Average tokens per request:", finalStats.averageTokensPerRequest);
  console.log("");

  // Test reset
  console.log("--- After reset ---");
  resetTokenStats();
  console.log("Token stats after reset:", getTokenStats());
}

testTokenTracking().catch(console.error);
