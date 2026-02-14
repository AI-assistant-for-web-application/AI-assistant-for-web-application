import React from 'react';
import { Zap, Trash2, CheckCircle2, WifiOff } from 'lucide-react';
import { CourseContext, ConversationStats } from './chatTypes';
import './ChatInterface.css';

interface Props {
  courseContext: CourseContext;
  messageCount: number;
  stats: ConversationStats;
  connectionStatus: any;
  showStats: boolean;
  setShowStats: (s: boolean) => void;
  onClear: () => void;
}

const ChatHeader = ({ courseContext, messageCount, stats, connectionStatus, showStats, setShowStats, onClear }: Props) => {
  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <h2>Course Assistant</h2>
        <p>{courseContext.code}: {courseContext.name}</p>
        <p className="chat-header-sub">
          {messageCount} message{messageCount !== 1 ? 's' : ''} • Quality: {stats.averageQuality}/100
        </p>
      </div>

      <div className="chat-header-actions">
        <div className="connection-status">
          {connectionStatus.isConnected ? (
            <>
              <CheckCircle2 size={18} className="status-icon connected" />
              <span className="status-text">Connected</span>
            </>
          ) : (
            <>
              <WifiOff size={18} className="status-icon disconnected" />
              <span className="status-text">Disconnected</span>
            </>
          )}
        </div>

        <button onClick={() => setShowStats(!showStats)} className="stats-button" title="Toggle statistics">
          <Zap size={18} />
        </button>

        <button onClick={onClear} className="clear-button" title="Clear conversation">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
