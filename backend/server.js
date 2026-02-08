import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { callGroqAPI } from "./groq-client.js";
import {
  initializeStore,
  createConversation,
  getConversation,
  getUserConversations,
  getMessages,
  deleteConversation,
} from "./conversation-store.js";

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

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, courseId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log(`[${new Date().toISOString()}] User: ${message}`);

    const result = await callGroqAPI(message, context || "");

    if (result?.success) {
      console.log(`[${new Date().toISOString()}] AI: ${result.message}`);
    } else {
      console.error(`[${new Date().toISOString()}] Error: ${result?.error}`);
    }

    res.json({
      success: result.success,
      message: result.message,
      error: result.error || null,
      courseId: courseId || "general",
      timestamp: new Date(),
      tokens: result.tokens || null,
      stats: result.stats || null,
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