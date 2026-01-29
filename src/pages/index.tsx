import { useState } from "react";
import CourseContent from "../components/CourseContent";
import ChatInterface from "../components/ChatInterface";

import "./index.css";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="pageShell">
      {/* Course Content - Left Side */}
      <CourseContent />

      {/* Floating chat toggle */}
      <button
        className="chat-toggle-button"
        aria-label={chatOpen ? "Close chat" : "Open chat"}
        onClick={() => setChatOpen((s) => !s)}
      >
        {chatOpen ? "Close" : "Chat"}
      </button>

      {/* Chat popup */}
      <div className={`chat-popup ${chatOpen ? "open" : "hidden"}`}>
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;