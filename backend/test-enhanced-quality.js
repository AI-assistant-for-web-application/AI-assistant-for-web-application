import dotenv from "dotenv";
dotenv.config();

import { scoreResponseQuality, generateQualityFeedback } from "./prompt-templates.js";

console.log("=== Enhanced Quality Scoring Test ===\n");

const testResponses = [
  {
    name: "Excellent Response",
    text: `Linear regression is a supervised learning algorithm used for predicting continuous values. 

For example, if you want to predict house prices based on square footage, you'd use linear regression. The algorithm finds the best-fit line through your training data by minimizing the cost function.

Why does this work? Because the relationship between features (like size) and the target (price) is often linear. The model learns parameters that minimize the difference between predicted and actual values.

Think of it like drawing a straight line through scattered points on a graph. Have you worked with regression before?`
  },
  {
    name: "Medium Response",
    text: "Linear regression is an algorithm that predicts values. It uses training data and finds a line that fits the data. You can use it for prediction problems where you need to estimate numbers."
  },
  {
    name: "Poor Response",
    text: "Linear regression maybe predicts stuff with data."
  }
];

testResponses.forEach(({ name, text }) => {
  console.log(`\n--- ${name} ---`);
  console.log(`Text: "${text.substring(0, 100)}..."\n`);
  
  const result = scoreResponseQuality(text);
  const feedback = generateQualityFeedback(result);
  
  console.log(`Overall Score: ${result.overall}/100`);
  console.log(`\nDimensions:`);
  console.log(`  Clarity:       ${result.dimensions.clarity}/100 (weight: ${result.breakdown.clarity.weight})`);
  console.log(`  Completeness:  ${result.dimensions.completeness}/100 (weight: ${result.breakdown.completeness.weight})`);
  console.log(`  Accuracy:      ${result.dimensions.accuracy}/100 (weight: ${result.breakdown.accuracy.weight})`);
  console.log(`  Engagement:    ${result.dimensions.engagement}/100 (weight: ${result.breakdown.engagement.weight})`);
  console.log(`  Pedagogy:      ${result.dimensions.pedagogy}/100 (weight: ${result.breakdown.pedagogy.weight})`);
  
  console.log(`\nFeedback:`);
  feedback.forEach(f => console.log(`  ${f}`));
  console.log("\n" + "=".repeat(60));
});

console.log("\n✓ Enhanced quality test completed!\n");