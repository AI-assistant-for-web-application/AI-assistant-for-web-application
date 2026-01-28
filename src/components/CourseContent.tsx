import { BookOpen, Clock, User } from "lucide-react";

const CourseContent = () => {
  // Mock course data
  const course = {
    title: "Introduction to Machine Learning",
    code: "CS 229",
    semester: "Fall 2024",
    instructor: "Dr. Sarah Chen",
    progress: 65,
  };

  const modules = [
    {
      id: 1,
      title: "Introduction to Supervised Learning",
      duration: "15 min",
      completed: true,
    },
    {
      id: 2,
      title: "Regression Analysis",
      duration: "25 min",
      completed: true,
    },
    {
      id: 3,
      title: "Classification Algorithms",
      duration: "30 min",
      completed: true,
    },
    {
      id: 4,
      title: "Model Evaluation Metrics",
      duration: "20 min",
      completed: false,
    },
    {
      id: 5,
      title: "Overfitting and Regularization",
      duration: "25 min",
      completed: false,
    },
    {
      id: 6,
      title: "Practical Exercise: Build Your First Model",
      duration: "45 min",
      completed: false,
    },
  ];

  const objectives = [
    "Understand the difference between supervised and unsupervised learning",
    "Apply regression techniques to continuous prediction problems",
    "Implement classification algorithms for categorical outcomes",
    "Evaluate model performance using appropriate metrics",
    "Recognize and address overfitting in machine learning models",
  ];

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {course.code} • {course.semester}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
              Module 3 of 6
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="mb-8 p-4 bg-white border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">
              Module Progress
            </span>
            <span className="text-sm text-gray-500">{course.progress}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Module */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Current Module
          </h2>
          <div className="p-6 bg-white border rounded-lg">
            <h3 className="text-base font-semibold mb-3 text-gray-900">
              Module 3: Supervised Learning Fundamentals
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Learn the core concepts of supervised learning, including regression
              and classification algorithms. Understand how to train models using
              labeled data and evaluate their performance.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>2.5 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Contents */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Module Contents
          </h2>
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      module.completed
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {module.id}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {module.title}
                    </h3>
                    <p className="text-xs text-gray-500">{module.duration}</p>
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Learning Objectives
          </h2>
          <div className="p-6 bg-white border rounded-lg">
            <ul className="space-y-3">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-600">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContent;
