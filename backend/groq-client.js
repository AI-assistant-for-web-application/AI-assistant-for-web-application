import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { buildSystemPrompt } from "./prompt-templates.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Token tracking
let tokenStats = {
  totalTokens: 0,
  totalPromptTokens: 0,
  totalCompletionTokens: 0,
  requestCount: 0,
};

// Get token statistics
export const getTokenStats = () => {
  return {
    ...tokenStats,
    averageTokensPerRequest:
      tokenStats.requestCount > 0
        ? Math.round(tokenStats.totalTokens / tokenStats.requestCount)
        : 0,
  };
};


// Reset token statistics
export const resetTokenStats = () => {
  tokenStats = {
    totalTokens: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    requestCount: 0,
  };
};


export const callGroqAPI = async (
  userMessage,
  courseCode = "CS 229",
  moduleKey = "default", 
  courseContext = ""
) => {
  const startTime = performance.now();

  try {
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not found in environment variables");
    }

    // Validate user message
    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error("User message cannot be empty");
    }

    // Build enhance system prompt from template
    const systemPrompt = buildSystemPrompt(courseCode, moduleKey, courseContext);

    console.log(
      `[Groq] Processing message for ${courseCode} - ${moduleKey}: "${userMessage.substring(0, 50)}..."`
    )

   // Make request to Groq API
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    // Extract response text
    const assistantMessage =
      response.data.choices[0].message.content || "No response from AI";
    // Extract token usage
    const promptTokens = response.data.usage.prompt_tokens || 0;
    const completionTokens = response.data.usage.completion_tokens || 0;
    const totalTokens = response.data.usage.total_tokens || 0;

    // Update token statistics
    tokenStats.totalTokens += totalTokens;
    tokenStats.totalPromptTokens += promptTokens;
    tokenStats.totalCompletionTokens += completionTokens;
    tokenStats.requestCount += 1;

    console.log(
      `[Groq] ✓ Response received (${responseTime}ms) - Module: ${moduleKey} - Tokens: ${totalTokens}`
    );

    return {
      success: true,
      message: assistantMessage,
      model: response.data.model,
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: totalTokens,
      },
      responseTime,
      stats: getTokenStats(),
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    // Determine error type and provide friendly message
    let errorType = "unknown";
    let friendlyMessage =
      "Sorry, I encountered an error processing your request. Please try again.";

    if (error instanceof axios.AxiosError) {
      if (!error.response) {
        // Network errors (no response received)
        if (error.code === "ECONNABORTED") {
          errorType = "timeout";
          friendlyMessage =
            "Request timeout: The server took too long to respond. Please try again.";
        } else {
          errorType = "network";
          friendlyMessage =
            "Network error: Cannot connect to Groq API. Please check your connection.";
        }
      } else {
        // HTTP errors (response received with error status)
        if (error.response.status === 401) {
          errorType = "auth";
          friendlyMessage =
            "Authentication error: Invalid or expired API key. Please check your credentials.";
        } else if (error.response.status === 429) {
          errorType = "rate_limit";
          friendlyMessage =
            "Rate limit exceeded: Please wait a moment before trying again.";
        } else if (error.response.status >= 500) {
          errorType = "server";
          friendlyMessage =
            "Server error: Groq API is experiencing issues. Please try again later.";
        } else if (error.response.status === 400) {
          errorType = "validation";
          friendlyMessage =
            "Invalid request: Please check your input and try again.";
        }
      }
    } else if (error instanceof Error) {
      // Custom validation errors
      if (error.message.includes("empty")) {
        errorType = "validation";
        friendlyMessage = "Validation error: " + error.message;
      } else if (error.message.includes("API_KEY")) {
        errorType = "config";
        friendlyMessage = "Configuration error: " + error.message;
      }
    }

    console.error(
      `[Groq] ✗ Error (${errorType}) after ${responseTime}ms: ${error instanceof Error ? error.message : error}`
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      errorType,
      message: friendlyMessage,
      responseTime,
      stats: getTokenStats(),
    };
  }
};
