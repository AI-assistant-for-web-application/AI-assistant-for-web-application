import { BookOpen, ChevronRight, Clock, User } from "lucide-react";

import "./CourseContent.css";

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
    <div className="coursePage">
      <header className="courseHeader">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="#">Home</a> / <a href="#">Courses</a> / <span>{course.code}</span>
        </nav>

        <div className="courseHeaderInner">
          <div className="courseTitleBlock">
            <div className="courseIconBadge" aria-hidden="true">
              <BookOpen size={18} color="#2563eb" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 className="courseTitle">{course.title}</h1>
              <p className="courseMeta">
                {course.code} • {course.semester}
              </p>
            </div>
          </div>

          <div className="coursePill">Module 3 of 6</div>
        </div>
      </header>

      <main className="main">
        <section className="card" aria-label="Progress">
          <div className="progressRow">
            <span className="progressLabel">Module Progress</span>
            <span className="progressValue">{course.progress}% complete</span>
          </div>
          <div className="progressBar" role="progressbar" aria-valuenow={course.progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progressBarFill" style={{ width: `${course.progress}%` }} />
          </div>
        </section>

        <section aria-label="Current module">
          <h2 className="sectionTitle">Current Module</h2>
          <div className="card">
            <h3 className="moduleTitle">Module 3: Supervised Learning Fundamentals</h3>
            <p className="moduleDesc">
              Learn the core concepts of supervised learning, including regression and classification algorithms.
              Understand how to train models using labeled data and evaluate their performance.
            </p>
            <div className="moduleMeta">
              <div className="metaItem">
                <Clock size={16} />
                <span>2.5 hours</span>
              </div>
              <div className="metaItem">
                <User size={16} />
                <span>{course.instructor}</span>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Module contents">
          <h2 className="sectionTitle">Module Contents</h2>
          <div className="list" role="list">
            {modules.map((module) => (
              <div key={module.id} className="listItem" role="listitem" tabIndex={0}>
                <div className="listLeft">
                  <div
                    className={`badgeNumber ${module.completed ? "badgeDone" : "badgeTodo"}`}
                    aria-label={module.completed ? "Completed" : "Not completed"}
                  >
                    {module.id}
                  </div>
                  <div className="itemText">
                    <p className="itemTitle">{module.title}</p>
                    <p className="itemSub">{module.duration}</p>
                  </div>
                </div>

                <ChevronRight className="chevron" size={18} />
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Learning objectives">
          <h2 className="sectionTitle">Learning Objectives</h2>
          <div className="card">
            <ul className="objectiveList">
              {objectives.map((objective, index) => (
                <li key={index} className="objectiveItem">
                  <span className="objectiveIndex" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseContent;
