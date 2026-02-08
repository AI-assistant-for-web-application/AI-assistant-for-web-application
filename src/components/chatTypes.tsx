export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    responseTime?: number;
    tokens?: {
      prompt: number;
      completion: number;
      total: number;
    };
    quality?: {
      score: number;
      followUpQuestion?: string;
    };
  };
  error?: {
    type: string;
    message: string;
    canRetry: boolean;
  };
}

export interface CourseContext {
  name: string;
  code: string;
  module: string;
}

export interface ConversationStats {
  totalMessages: number;
  totalTokens: number;
  totalTime: number;
  averageQuality: number;
}

export interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastChecked: Date;
}

export type ConnStatus = ConnectionStatus;

