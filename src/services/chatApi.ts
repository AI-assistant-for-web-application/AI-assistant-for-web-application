export interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastChecked: Date;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  responseTime?: number;
  tokens?: { prompt: number; completion: number; total: number };
  quality?: { score: number; followUpQuestion?: string };
  errorType?: string;
  error?: string;
}

// Call the real backend at http://localhost:3001
const BACKEND_URL = 'http://localhost:3001';

export const sendMessage = async (text: string, courseCode?: string, context?: string): Promise<ApiResponse> => {
  const startTime = Date.now();
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, courseId: courseCode, context: context || '' }),
    });
    
    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    if (data.success) {
      return {
        success: true,
        message: data.message || data.response || 'No message',
        responseTime,
        tokens: data.tokens || { prompt: 0, completion: 0, total: 0 },
        quality: data.quality || { score: 75 },
      };
    } else {
      return {
        success: false,
        message: data.error || 'Failed to get response',
        errorType: 'api_error',
        error: data.error || 'Unknown error',
      };
    }
  } catch (err) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      message: 'Failed to connect to backend. Make sure server is running on port 3001.',
      responseTime,
      errorType: 'network',
      error: err instanceof Error ? err.message : 'Connection error',
    };
  }
};

export const checkConnection = async (): Promise<ConnectionStatus> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const isConnected = response.ok;
    return { isOnline: true, isConnected, lastChecked: new Date() };
  } catch (err) {
    return { isOnline: false, isConnected: false, lastChecked: new Date() };
  }
};
