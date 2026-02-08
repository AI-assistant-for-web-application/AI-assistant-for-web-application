import {
  getPromptTemplate,
  getAvailableModules,
  buildSystemPrompt,
  getRelevantFollowUpQuestion,
} from "./prompt-templates.js";

console.log("=== Prompt Templates Test ===\n");

// Test 1: List available modules
console.log("--- Test 1: Available Modules ---");
const modules = getAvailableModules();
console.log("Available modules:", modules);
console.log("Total modules:", modules.length);
console.log("");

// Test 2: Get specific template
console.log("--- Test 2: Get Template ---");
const regressionTemplate = getPromptTemplate("regression");
console.log("Regression template:");
console.log("- Has systemPrompt:", !!regressionTemplate.systemPrompt);
console.log("- Has followUpQuestions:", !!regressionTemplate.followUpQuestions);
console.log("- Number of follow-up questions:", regressionTemplate.followUpQuestions.length);
console.log("- First 100 chars:", regressionTemplate.systemPrompt.substring(0, 100) + "...");
console.log("");

// Test 3: Get default template
console.log("--- Test 3: Default Template ---");
const defaultTemplate = getPromptTemplate("nonexistent");
console.log("Non-existent module returns default:", defaultTemplate === getPromptTemplate("default"));
console.log("");

// Test 4: Build system prompt
console.log("--- Test 4: Build System Prompt ---");
const systemPrompt = buildSystemPrompt(
  "CS 229",
  "regression",
  "Student is a beginner with basic Python knowledge"
);
console.log("Built system prompt:");
console.log(systemPrompt);
console.log("");

// Test 5: Get follow-up questions
console.log("--- Test 5: Follow-up Questions ---");
console.log("Regression follow-up questions:");
for (let i = 0; i < 3; i++) {
  const question = getRelevantFollowUpQuestion("regression");
  console.log(`  ${i + 1}. ${question}`);
}
console.log("");

// Test 6: Test all modules
console.log("--- Test 6: All Modules Have Required Data ---");
modules.forEach(moduleKey => {
  const template = getPromptTemplate(moduleKey);
  const hasPrompt = !!template.systemPrompt && template.systemPrompt.length > 50;
  const hasQuestions = !!template.followUpQuestions && template.followUpQuestions.length >= 4;
  console.log(`${moduleKey}: ${hasPrompt && hasQuestions ? '✓' : '✗'} (Prompt: ${hasPrompt}, Questions: ${hasQuestions})`);
});
console.log("");

console.log("✓ All tests completed!");
