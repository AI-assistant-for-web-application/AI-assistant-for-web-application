import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { callGroqAPI } from "./groq-client.js";
import {
  initializeStore,
  createConversation,
  getConversation,
  getUserConversations,
  addMessage,
  getMessages,
  searchMessages,
  searchAllMessages,
  deleteConversation,
  exportConversation,
  exportConversationAsText,
  getConversationStats,
} from "./conversation-store.js";

//  Monitoring imports
import {
  logError,
  trackRequest,
  getMonitoringData,
  healthCheck,
} from "./monitoring.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize conversation store
await initializeStore();

// =====================
// Routes
// =====================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Backend is running!",
    timestamp: new Date(),
  });
});

// Create new conversation
app.post("/api/conversations", (req, res) => {
  try {
    const { userId, courseCode, moduleName } = req.body;

    if (!userId || !courseCode) {
      return res.status(400).json({
        success: false,
        error: "userId and courseCode are required",
      });
    }

    const conversationId = createConversation(userId, courseCode, moduleName || "General");

    res.json({
      success: true,
      conversationId,
      message: "Conversation created successfully",
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create conversation",
    });
  }
});

// Get conversation history
app.get("/api/conversations/:conversationId/messages", (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    const messages = getMessages(conversationId);

    res.json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    });
  }
});

// Get all user conversations
app.get("/api/conversations/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = getUserConversations(userId);

    res.json({
      success: true,
      conversations,
      count: conversations.length,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversations",
    });
  }
});

// Search messages in conversation
app.get("/api/conversations/:conversationId/search", (req, res) => {
  try {
    const { conversationId } = req.params;
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: "keyword parameter is required",
      });
    }

    const results = searchMessages(conversationId, keyword);

    res.json({
      success: true,
      keyword,
      matches: results.length,
      results,
    });
  } catch (error) {
    console.error("Error searching messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search messages",
    });
  }
});

// Search across all conversations
app.get("/api/search", (req, res) => {
  try {
    const { userId, keyword } = req.query;

    if (!userId || !keyword) {
      return res.status(400).json({
        success: false,
        error: "userId and keyword are required",
      });
    }

    const results = searchAllMessages(userId, keyword);

    res.json({
      success: true,
      keyword,
      conversations: results.length,
      results,
    });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search",
    });
  }
});

// Get conversation statistics
app.get("/api/conversations/:conversationId/stats", (req, res) => {
  try {
    const { conversationId } = req.params;

    const stats = getConversationStats(conversationId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
});

// Export conversation (JSON)
app.get("/api/conversations/:conversationId/export", (req, res) => {
  try {
    const { conversationId } = req.params;

    const data = exportConversation(conversationId);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error exporting conversation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export conversation",
    });
  }
});

// Export conversation (Text)
app.get("/api/conversations/:conversationId/export/text", (req, res) => {
  try {
    const { conversationId } = req.params;

    const text = exportConversationAsText(conversationId);

    if (!text) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="conversation-${conversationId}.txt"`);
    res.send(text);
  } catch (error) {
    console.error("Error exporting conversation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export conversation",
    });
  }
});

// Chat endpoint (now stores messages)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, courseId, context, conversationId, userId, moduleKey } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log(`[${new Date().toISOString()}] User: ${message}`);
    console.log(`[${new Date().toISOString()}] Module: ${moduleKey || "default"}`);

    // Create or get conversation
    let convId = conversationId;
    if (!convId && userId) {
      convId = createConversation(userId, courseId || "CS 229", "General");
    }

    // Store user message
    if (convId) {
      addMessage(convId, message, "user");
    }

    // Call Groq API with enhanced prompts
    const result = await callGroqAPI(message, courseId || "CS 229", moduleKey || "default", context || "");

    // Store assistant message
    if (convId && result.success) {
      addMessage(
        convId,
        result.message,
        "assistant",
        result.tokens,
        result.responseTime
      );
    }

    if (result?.success) {
      console.log(`[${new Date().toISOString()}] AI: ${result.message.substring(0, 100)}...`);
    } else {
      console.error(`[${new Date().toISOString()}] Error: ${result?.error}`);
    }

    // Return response
    res.json({
      success: result.success,
      message: result.message,
      error: result.error || null,
      conversationId: convId,
      courseId: courseId || "general",
      moduleKey : moduleKey || "default",
      timestamp: new Date(),
      tokens: result.tokens || null,
      quality: result.quality || null,
      responseTime: result.responseTime,
      followUpQuestion: result.followUpQuestion || null,
      stats : result.stats || null,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "An error occurred while processing your request",
    });
  }
});

// Delete conversation
app.delete("/api/conversations/:conversationId", (req, res) => {
  try {
    const { conversationId } = req.params;

    deleteConversation(conversationId);

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete conversation",
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: `${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`✓ Health check: GET http://localhost:${PORT}/health`);
  console.log(`✓ Conversations: GET http://localhost:${PORT}/api/conversations/user/:userId\n`);
});