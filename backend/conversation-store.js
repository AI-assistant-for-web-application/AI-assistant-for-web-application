// In-memory store (production would use database)
let conversations = {};
let messageStore = {};

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

  // Messages will be added in a later stage
  messageStore[conversationId] = [];

  console.log(`[Store] Created conversation: ${conversationId}`);
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

export default {
  createConversation,
  getConversation,
  getUserConversations,
};