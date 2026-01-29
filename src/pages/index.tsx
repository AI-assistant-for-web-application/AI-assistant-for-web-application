import CourseContent from "../components/CourseContent";

const Index = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Course Content - Left Side */}
      <CourseContent />

      {/* Chat Sidebar - Right Side (will add later) */}
      {/* <ChatSidebar /> */}
    </div>
  );
};

export default Index;