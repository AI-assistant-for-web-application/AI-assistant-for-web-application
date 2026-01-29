import CourseContent from "../components/CourseContent";

import "./index.css";

const Index = () => {
  return (
    <div className="pageShell">
      {/* Course Content - Left Side */}
      <CourseContent />

      {/* Chat Sidebar - Right Side (will add later) */}
      {/* <ChatSidebar /> */}
    </div>
  );
};

export default Index;