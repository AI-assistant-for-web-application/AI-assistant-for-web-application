import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { callGroqAPI } from "./groq-client.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =====================
// Routes
// =====================

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Backend is running!",
    timestamp: new Date(),
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, courseId, context } = req.body;

    // Validate request
    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log(`[${new Date().toISOString()}] User: ${message}`);

    // Call Groq API
    const result = await callGroqAPI(message, context || "");

    // Log response
    if (result?.success) {
      console.log(
        `[${new Date().toISOString()}] AI: ${result.message}`
      );
    } else {
      console.error(
        `[${new Date().toISOString()}] Error: ${result?.error}`
      );
    }

    // Return response
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
  console.log(`✓ Health check: GET http://localhost:${PORT}/health\n`);
});
