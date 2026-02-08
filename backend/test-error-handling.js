import dotenv from "dotenv";
dotenv.config();

import { callGroqAPI } from "./groq-client.js";

console.log("=== Error Handling Test ===\n");

async function testErrorHandling() {
  // Test 1: Empty message
  console.log("--- Test 1: Empty Message ---");
  const result1 = await callGroqAPI("");
  console.log("Success:", result1.success);
  console.log("Error Type:", result1.errorType);
  console.log("Message:", result1.message);
  console.log("Response Time:", result1.responseTime + "ms");
  console.log("");

  // Test 2: Valid message
  console.log("--- Test 2: Valid Request ---");
  const result2 = await callGroqAPI("Hello");
  console.log("Success:", result2.success);
  if (result2.success) {
    console.log("Response Time:", result2.responseTime + "ms");
    console.log("Tokens Used:", result2.tokens.total);
  }
  console.log("");

  // Test 3: Whitespace only
  console.log("--- Test 3: Whitespace Only ---");
  const result3 = await callGroqAPI("   ");
  console.log("Success:", result3.success);
  console.log("Error Type:", result3.errorType);
  console.log("Message:", result3.message);
  console.log("");
}

testErrorHandling().catch(console.error);
