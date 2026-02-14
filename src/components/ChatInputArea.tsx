import React from 'react';
import { Send } from 'lucide-react';
import './ChatInterface.css';

interface Props {
  inputValue: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const ChatInputArea = ({ inputValue, onChange, onSend, onKeyPress, disabled }: Props) => {
  return (
    <div className="chat-input-area">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={disabled ? 'Backend not connected...' : 'Type your message...'}
        className="chat-input"
        disabled={disabled}
      />
      <button onClick={onSend} className="send-button" disabled={inputValue.trim() === '' || disabled}>
        <Send size={20} />
      </button>
    </div>
  );
};

export default ChatInputArea;
