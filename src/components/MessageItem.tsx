import React from 'react';
import { AlertCircle, Copy, MessageCircle } from 'lucide-react';
import { Message } from './chatTypes';
import './ChatInterface.css';

interface Props {
  message: Message;
  copiedMessageId: number | null;
  onCopy: (id: number, text: string) => void;
  onRetry: (id: number) => void;
  isLoading: boolean;
  formatTokens: (n: number) => string;
  formatTime: (ms: number) => string;
  formatQuality: (score: number) => string;
}

const MessageItem = ({ message, copiedMessageId, onCopy, onRetry, isLoading, formatTokens, formatTime, formatQuality }: Props) => {
  return (
    <div>
      <div className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'} ${message.error ? 'message-error' : ''}`}>
        <div className="message-content">
          {message.error && (
            <div className="error-header">
              <AlertCircle size={16} />
              <span>Error</span>
            </div>
          )}
          <p>{message.text}</p>
          <span className="message-time">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {!message.error && (
          <button onClick={() => onCopy(message.id, message.text)} className="copy-button" title="Copy message">
            {copiedMessageId === message.id ? '✓ Copied' : <Copy size={16} />}
          </button>
        )}
      </div>

      {message.error?.canRetry && (
        <div className="message-actions">
          <button onClick={() => onRetry(message.id)} className="retry-button" disabled={isLoading}>
            Retry
          </button>
        </div>
      )}

      {message.sender === 'assistant' && message.metadata && !message.error && (
        <div className="message-metadata">
          <div className="metadata-row">
            <span className="metadata-item">
              🔹 Tokens: {formatTokens(message.metadata.tokens?.total || 0)}
              <span className="metadata-detail">({formatTokens(message.metadata.tokens?.prompt || 0)} + {formatTokens(message.metadata.tokens?.completion || 0)})</span>
            </span>
            <span className="metadata-item">⏱ {formatTime(message.metadata.responseTime || 0)}</span>
          </div>
          {message.metadata.quality && (
            <div className="metadata-row quality-row">
              <span className="quality-score">Quality: {formatQuality(message.metadata.quality.score)}</span>
              {message.metadata.quality.followUpQuestion && (
                <span className="followup-suggestion"><MessageCircle size={14} />{message.metadata.quality.followUpQuestion}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
