import React from 'react';
import { Message } from './chatTypes';
import MessageItem from './MessageItem';

interface Props {
  messages: Message[];
  copiedMessageId: number | null;
  onCopy: (id: number, text: string) => void;
  onRetry: (id: number) => void;
  isLoading: boolean;
  formatTokens: (n: number) => string;
  formatTime: (ms: number) => string;
  formatQuality: (score: number) => string;
}

const MessagesList = ({ messages, copiedMessageId, onCopy, onRetry, isLoading, formatTokens, formatTime, formatQuality }: Props) => {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          copiedMessageId={copiedMessageId}
          onCopy={onCopy}
          onRetry={onRetry}
          isLoading={isLoading}
          formatTokens={formatTokens}
          formatTime={formatTime}
          formatQuality={formatQuality}
        />
      ))}
    </div>
  );
};

export default MessagesList;
