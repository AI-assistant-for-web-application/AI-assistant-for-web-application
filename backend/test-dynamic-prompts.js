import dotenv from "dotenv";
dotenv.config();

import { callGroqAPI } from "./groq-client.js";

console.log("=== Dynamic Prompts Integration Test ===\n");

async function testDynamicPrompts() {
  const testQuestion = "What is overfitting?";

  // Test 1: Default module
  console.log("--- Test 1: Default Module ---");
  const result1 = await callGroqAPI(testQuestion);
  if (result1.success) {
    console.log("Response:", result1.message.substring(0, 150) + "...");
    console.log("Response time:", result1.responseTime + "ms");
  }
  console.log("");

  // Test 2: Regression module
  console.log("--- Test 2: Regression Module ---");
  const result2 = await callGroqAPI(testQuestion, "CS 229", "regression");
  if (result2.success) {
    console.log("Response:", result2.message.substring(0, 150) + "...");
    console.log("Response time:", result2.responseTime + "ms");
  }
  console.log("");

  // Test 3: Classification module
  console.log("--- Test 3: Classification Module ---");
  const result3 = await callGroqAPI(testQuestion, "CS 229", "classification");
  if (result3.success) {
    console.log("Response:", result3.message.substring(0, 150) + "...");
    console.log("Response time:", result3.responseTime + "ms");
  }
  console.log("");

  // Test 4: With additional context
  console.log("--- Test 4: With Student Context ---");
  const result4 = await callGroqAPI(
    testQuestion,
    "CS 229",
    "regression",
    "Student is struggling with the mathematical concepts"
  );
  if (result4.success) {
    console.log("Response:", result4.message.substring(0, 150) + "...");
    console.log("Response time:", result4.responseTime + "ms");
  }
  console.log("");

  // Test 5: Supervised Learning module
  console.log("--- Test 5: Supervised Learning Module ---");
  const result5 = await callGroqAPI(
    "What is the difference between classification and regression?",
    "CS 229",
    "supervisedLearning"
  );
  if (result5.success) {
    console.log("Response:", result5.message.substring(0, 150) + "...");
    console.log("Response time:", result5.responseTime + "ms");
  }
  console.log("");

  console.log("✓ All tests completed!");
}

testDynamicPrompts().catch(console.error);

