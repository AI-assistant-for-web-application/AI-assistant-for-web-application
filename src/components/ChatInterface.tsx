import { useEffect, useState } from 'react';
import { sendMessage, checkConnection, ConnectionStatus, ApiResponse } from '@/services/chatApi';
import './ChatInterface.css';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import ChatInputArea from './ChatInputArea';
import { Message, CourseContext, ConversationStats } from './chatTypes';

const ChatInterface = () => {
  const courseContext: CourseContext = {
    name: 'Introduction to Machine Learning',
    code: 'CS 229',
    module: 'Module 3: Classification Algorithms',
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your assistant for ${courseContext.name} (${courseContext.code}). Ask me anything about this course!`,
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ isOnline: true, isConnected: true, lastChecked: new Date() });
  const [showStats, setShowStats] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      const status = await checkConnection();
      setConnectionStatus(status);
    };

    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getContextString = () => `Course: ${courseContext.name} (${courseContext.code}). Current: ${courseContext.module}`;

  const getConversationStats = (): ConversationStats => {
    const assistantMessages = messages.filter((m) => m.sender === 'assistant' && !m.error);
    return {
      totalMessages: messages.filter((m) => m.sender === 'user').length,
      totalTokens: assistantMessages.reduce((sum, msg) => sum + (msg.metadata?.tokens?.total || 0), 0),
      totalTime: assistantMessages.reduce((sum, msg) => sum + (msg.metadata?.responseTime || 0), 0),
      averageQuality: assistantMessages.length > 0 ? Math.round(assistantMessages.reduce((sum, msg) => sum + (msg.metadata?.quality?.score || 0), 0) / assistantMessages.length) : 0,
    };
  };

  const formatTokens = (tokens: number) => tokens.toLocaleString();
  const formatTime = (ms: number) => (ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`);
  const formatQuality = (score: number) => (score >= 80 ? '⭐ Excellent' : score >= 60 ? '✓ Good' : score >= 40 ? '~ Fair' : '⚠ Poor');

  const handleCopyMessage = (messageId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    if (!connectionStatus.isConnected) { alert('Backend is not connected.'); return; }

    const userMessage: Message = { id: messages.length + 1, text: inputValue, sender: 'user', timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const result: ApiResponse = await sendMessage(inputValue, courseContext.code, getContextString());
      if (result.success) {
        const assistantMessage: Message = { id: updatedMessages.length + 1, text: result.message, sender: 'assistant', timestamp: new Date(), metadata: { responseTime: result.responseTime, tokens: result.tokens, quality: result.quality } };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = { id: updatedMessages.length + 1, text: result.message, sender: 'assistant', timestamp: new Date(), error: { type: result.errorType || 'unknown', message: result.error || 'Unknown error', canRetry: result.errorType === 'network' || result.errorType === 'timeout' } };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { id: updatedMessages.length + 1, text: 'An unexpected error occurred.', sender: 'assistant', timestamp: new Date(), error: { type: 'unknown', message: error instanceof Error ? error.message : 'Unknown', canRetry: false } };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryMessage = async (messageId: number) => {
    const userMessage = messages.find((m) => m.id === messageId - 1 && m.sender === 'user');
    if (!userMessage) return;

    setIsLoading(true);
    try {
      const result: ApiResponse = await sendMessage(userMessage.text, courseContext.code, getContextString());
      if (result.success) {
        const assistantMessage: Message = { id: messageId, text: result.message, sender: 'assistant', timestamp: new Date(), metadata: { responseTime: result.responseTime, tokens: result.tokens, quality: result.quality } };
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? assistantMessage : msg)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && !e.shiftKey && !isLoading) { e.preventDefault(); handleSendMessage(); } };

  const handleClearConversation = () => {
    if (window.confirm('Clear conversation?')) {
      setMessages([{ id: 1, text: `Hello! I'm your assistant for ${courseContext.name} (${courseContext.code}). Ask me anything!`, sender: 'assistant', timestamp: new Date() }]);
      setShowStats(false);
    }
  };

  const messageCount = messages.length - 1;
  const stats = getConversationStats();

  return (
    <div className="chat-container">
      <ChatHeader courseContext={courseContext} messageCount={messageCount} stats={stats} connectionStatus={connectionStatus} showStats={showStats} setShowStats={setShowStats} onClear={handleClearConversation} />

      {showStats && (
        <div className="stats-panel">
          <div className="stats-title">Session Statistics</div>
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-label">Messages</span><span className="stat-value">{stats.totalMessages}</span></div>
            <div className="stat-item"><span className="stat-label">Tokens</span><span className="stat-value">{formatTokens(stats.totalTokens)}</span></div>
            <div className="stat-item"><span className="stat-label">Quality</span><span className="stat-value">{stats.averageQuality}/100</span></div>
          </div>
        </div>
      )}

      <MessagesList messages={messages} copiedMessageId={copiedMessageId} onCopy={handleCopyMessage} onRetry={handleRetryMessage} isLoading={isLoading} formatTokens={formatTokens} formatTime={formatTime} formatQuality={formatQuality} />

      {isLoading && (
        <div className="message assistant-message"><div className="message-content"><p>Thinking...</p></div></div>
      )}

      <ChatInputArea inputValue={inputValue} onChange={setInputValue} onSend={handleSendMessage} onKeyPress={handleKeyPress} disabled={isLoading || !connectionStatus.isConnected} />
    </div>
  );
};

export default ChatInterface;
