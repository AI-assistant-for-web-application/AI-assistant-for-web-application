import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

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

export const callGroqAPI = async (userMessage, courseContext = "") => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not found in environment variables");
    }

    // Create system prompt with course context
    const systemPrompt = `You are a helpful course assistant for students. 
You help students understand course concepts, answer questions about the material, and provide explanations.
Be concise but thorough in your responses.
${courseContext ? `Current course context: ${courseContext}` : ""}`;

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
      }
    );

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

    console .log(`[Groq API] Prompt tokens: ${promptTokens}, Completion: ${completionTokens}, Total: ${totalTokens}`);

    return {
      success: true,
      message: assistantMessage,
      model: response.data.model,
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: totalTokens,
      },
      stats: getTokenStats(),
    };
  } catch (error) {
    console.error("Groq API Error:", error.message);

    return {
      success: false,
      error: error.message,
      message:
        "Sorry, I encountered an error processing your request. Please try again.",
    };
  }
};