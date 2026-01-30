import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

    return {
      success: true,
      message: assistantMessage,
      model: response.data.model,
      tokens: {
        prompt: response.data.usage.prompt_tokens,
        completion: response.data.usage.completion_tokens,
        total: response.data.usage.total_tokens,
      },
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