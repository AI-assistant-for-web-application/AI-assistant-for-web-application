import dotenv from "dotenv";
dotenv.config();

import { callGroqAPI } from "./groq-client.js";

console.log("=== Follow-up Questions Test ===\n");

async function testFollowUpQuestions() {
  const modules = [
    "regression",
    "classification",
    "supervisedLearning",
    "evaluation",
    "regularization",
    "default"
  ];

  console.log("Testing follow-up questions for each module:\n");

  for (const moduleKey of modules) {
    console.log(`--- Module: ${moduleKey} ---`);
    
    const result = await callGroqAPI(
      "What is overfitting?",
      "CS 229",
      moduleKey
    );

    if (result.success) {
      console.log("✓ Response received");
      console.log("Follow-up question:", result.followUpQuestion || "None");
      console.log("");
    } else {
      console.log("✗ Error:", result.error);
      console.log("");
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Test multiple calls to same module (should get different questions)
  console.log("--- Testing Question Variety (Regression Module) ---");
  const questions = new Set();
  
  for (let i = 0; i < 5; i++) {
    const result = await callGroqAPI(
      "Explain gradient descent",
      "CS 229",
      "regression"
    );
    
    if (result.success && result.followUpQuestion) {
      questions.add(result.followUpQuestion);
      console.log(`${i + 1}. ${result.followUpQuestion}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\nUnique questions received: ${questions.size} out of 5 calls`);
  console.log("(Should vary due to random selection)");
  console.log("");

  console.log("✓ All tests completed!");
}

testFollowUpQuestions().catch(console.error);
