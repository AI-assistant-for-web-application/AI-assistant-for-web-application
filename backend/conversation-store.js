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
  return true;
};

export default {
  createConversation,
  getConversation,
  getUserConversations,
  addMessage,
  getMessages,
  searchMessages,
  searchAllMessages,
  deleteConversation,
};