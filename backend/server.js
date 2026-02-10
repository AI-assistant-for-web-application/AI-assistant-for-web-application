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

// Monitoring middleware (tracks every request)
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    trackRequest(req.path, req.method, res.statusCode, duration);
  });

  next();
});


// Initialize conversation store
await initializeStore();

// =====================
// Routes
// =====================

// Health check (with monitoring)
app.get("/health", async (req, res) => {
  try {
    const health = await healthCheck();
    res.status(health.status === "healthy" ? 200 : 503).json(health);
  } catch (error) {
    logError("HEALTH_CHECK_FAILED", error?.message || "Unknown error");
    res.status(500).json({
      status: "error",
      message: "Health check failed",
    });
  }
});

// Monitoring data endpoint (JSON)
app.get("/api/monitoring", (req, res) => {
  try {
    const data = getMonitoringData();
    res.json({
      success: true,
      monitoring: data,
    });
  } catch (error) {
    logError("MONITORING_ERROR", error?.message || "Unknown error");
    res.status(500).json({
      success: false,
      error: "Failed to get monitoring data",
    });
  }
});

// Monitoring dashboard (HTML)
app.get("/dashboard", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Monitoring Dashboard</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        h1 { color: #333; }
        .metric {
          background: white;
          padding: 15px;
          margin: 10px 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .metric-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .metric-value {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        .endpoints {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 20px;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        th { background-color: #f9fafb; font-weight: bold; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
      </style>
      <script>
        async function updateDashboard() {
          try {
            const response = await fetch('/api/monitoring');
            const data = await response.json();
            const m = data.monitoring;

            document.getElementById('uptime').textContent = m.uptime + 's';
            document.getElementById('requests').textContent = m.totalRequests;
            document.getElementById('successRate').textContent = m.successRate + '%';
            document.getElementById('avgTime').textContent = m.averageResponseTime + 'ms';
            document.getElementById('errors').textContent = m.recentErrors.length;

            let endpointHtml = '';
            m.endpoints.forEach(ep => {
              endpointHtml += \`
                <tr>
                  <td>\${ep.endpoint}</td>
                  <td>\${ep.calls}</td>
                  <td>\${ep.averageTime}ms</td>
                  <td class="\${ep.errors > 0 ? 'error' : 'success'}">\${ep.errorRate}%</td>
                </tr>
              \`;
            });
            document.getElementById('endpoints').innerHTML = endpointHtml;
          } catch (error) {
            console.error('Failed to update dashboard:', error);
          }
        }

        updateDashboard();
        setInterval(updateDashboard, 5000);
      </script>
    </head>
    <body>
      <h1>API Monitoring Dashboard</h1>

      <div class="grid">
        <div class="metric">
          <div class="metric-label">Uptime</div>
          <div class="metric-value" id="uptime">0s</div>
        </div>
        <div class="metric">
          <div class="metric-label">Total Requests</div>
          <div class="metric-value" id="requests">0</div>
        </div>
        <div class="metric">
          <div class="metric-label">Success Rate</div>
          <div class="metric-value" id="successRate">0%</div>
        </div>
        <div class="metric">
          <div class="metric-label">Avg Response Time</div>
          <div class="metric-value" id="avgTime">0ms</div>
        </div>
        <div class="metric">
          <div class="metric-label">Recent Errors</div>
          <div class="metric-value error" id="errors">0</div>
        </div>
      </div>

      <div class="endpoints">
        <h2>Endpoint Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Calls</th>
              <th>Avg Time</th>
              <th>Error Rate</th>
            </tr>
          </thead>
          <tbody id="endpoints"></tbody>
        </table>
      </div>
    </body>
    </html>
  `);
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