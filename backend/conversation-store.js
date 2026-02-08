import fs from "fs/promises";
import path from "path";

// In-memory store (production would use database)
let conversations = {};
let messageStore = {};

const DATA_DIR = "./data";
const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

// Initialize data directory and load existing data
export const initializeStore = async () => {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Load existing conversations
    try {
      const conversationsData = await fs.readFile(CONVERSATIONS_FILE, "utf-8");
      conversations = JSON.parse(conversationsData);
      console.log(`[Store] Loaded ${Object.keys(conversations).length} conversations`);
    } catch (e) {
      console.log("[Store] No existing conversations found, starting fresh");
    }

    // Load existing messages
    try {
      const messagesData = await fs.readFile(MESSAGES_FILE, "utf-8");
      messageStore = JSON.parse(messagesData);
      console.log(`[Store] Loaded ${Object.keys(messageStore).length} message lists`);
    } catch (e) {
      console.log("[Store] No existing messages found, starting fresh");
    }
  } catch (error) {
    console.error("[Store] Failed to initialize:", error.message);
  }
};

// Save data to files
const saveData = async () => {
  try {
    await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messageStore, null, 2));
  } catch (error) {
    console.error("[Store] Failed to save data:", error.message);
  }
};

// Create new conversation
export const createConversation = (userId, courseCode, moduleName) => {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  conversations[conversationId] = {
    id: conversationId,
    userId,
    courseCode,
    moduleName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageCount: 0,
    title: `${courseCode}: ${moduleName}`,
  };

  messageStore[conversationId] = [];

  console.log(`[Store] Created conversation: ${conversationId}`);
  saveData();

  return conversationId;
};

// Get conversation by ID
export const getConversation = (conversationId) => {
  return conversations[conversationId] || null;
};

// Get all conversations for user
export const getUserConversations = (userId) => {
  return Object.values(conversations).filter((conv) => conv.userId === userId);
};

// Add message to conversation
export const addMessage = (conversationId, message, sender, tokens = null, responseTime = null) => {
  if (!messageStore[conversationId]) {
    messageStore[conversationId] = [];
  }

  const messageRecord = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    conversationId,
    sender,
    text: message,
    timestamp: new Date().toISOString(),
    tokens,
    responseTime,
  };

  messageStore[conversationId].push(messageRecord);

  // Update conversation metadata
  if (conversations[conversationId]) {
    conversations[conversationId].updatedAt = new Date().toISOString();
    conversations[conversationId].messageCount = messageStore[conversationId].length;
  }

  console.log(`[Store] Added message to ${conversationId}`);
  saveData();

  return messageRecord;
};

// Get messages from conversation
export const getMessages = (conversationId) => {
  return messageStore[conversationId] || [];
};

// Search messages by keyword
export const searchMessages = (conversationId, keyword) => {
  const messages = messageStore[conversationId] || [];
  const lowerKeyword = keyword.toLowerCase();

  return messages.filter((msg) => msg.text.toLowerCase().includes(lowerKeyword));
};

// Search across all conversations
export const searchAllMessages = (userId, keyword) => {
  const userConversations = getUserConversations(userId);
  const results = [];

  userConversations.forEach((conv) => {
    const messages = searchMessages(conv.id, keyword);
    if (messages.length > 0) {
      results.push({
        conversationId: conv.id,
        title: conv.title,
        matches: messages.length,
        messages,
      });
    }
  });

  return results;
};

// Delete conversation
export const deleteConversation = (conversationId) => {
  delete conversations[conversationId];
  delete messageStore[conversationId];
  console.log(`[Store] Deleted conversation: ${conversationId}`);
  saveData();
  return true;
};

// Export conversation as JSON
export const exportConversation = (conversationId) => {
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);

  if (!conversation) {
    return null;
  }

  return {
    conversation,
    messages,
    exportedAt: new Date().toISOString(),
  };
};

// Export conversation as formatted text
export const exportConversationAsText = (conversationId) => {
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);

  if (!conversation) {
    return null;
  }

  // Format conversation details and messages into readable text
  let text = `Conversation: ${conversation.title}\n`;
  text += `Course: ${conversation.courseCode}\n`;
  text += `Module: ${conversation.moduleName}\n`;
  text += `Created: ${conversation.createdAt}\n`;
  text += `Messages: ${conversation.messageCount}\n`;
  text += `\n${"=".repeat(60)}\n\n`;

  // Format each message with sender, timestamp, and content
  messages.forEach((msg) => {
    const sender = msg.sender === "user" ? "You" : "Assistant";
    const time = new Date(msg.timestamp).toLocaleTimeString();
    text += `[${time}] ${sender}:\n${msg.text}\n\n`;

    if (msg.tokens) {
      text += `  Tokens: ${msg.tokens.total} | Response: ${msg.responseTime}ms\n\n`;
    }
  });

  return text;
};

// Get conversation statistics
export const getConversationStats = (conversationId) => {
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);

  if (!conversation) {
    return null;
  }

  // Calculate statistics for user and assistant messages
  const userMessages = messages.filter((m) => m.sender === "user");
  const assistantMessages = messages.filter((m) => m.sender === "assistant");
  const totalTokens = assistantMessages.reduce((sum, msg) => sum + (msg.tokens?.total || 0), 0);
  const totalTime = assistantMessages.reduce((sum, msg) => sum + (msg.responseTime || 0), 0);

  // Calculate average tokens and response time for assistant messages
  return {
    conversationId,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    totalMessages: messages.length,
    userMessages: userMessages.length,
    assistantMessages: assistantMessages.length,
    totalTokens,
    totalTime,
    averageTokensPerResponse:
      assistantMessages.length > 0
        ? Math.round(totalTokens / assistantMessages.length)
        : 0,
    averageResponseTime:
      assistantMessages.length > 0 ? Math.round(totalTime / assistantMessages.length) : 0,
  };
};

export default {
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
};