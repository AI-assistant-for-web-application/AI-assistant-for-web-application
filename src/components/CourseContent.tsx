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

  const assessments = {
    assignments: [
      {
        id: 1,
        title: "Assignment 1: Data Understanding & Preprocessing",
        marks: 10,
        intro:
          "Explore a small real-world dataset, clean missing values, handle outliers, and document your preprocessing choices.",
      },
      {
        id: 2,
        title: "Assignment 2: Linear Regression Baseline",
        marks: 10,
        intro:
          "Build a regression baseline, interpret coefficients, and report error metrics with a short discussion of model assumptions.",
      },
      {
        id: 3,
        title: "Assignment 3: Classification & Decision Boundaries",
        marks: 10,
        intro:
          "Implement a classifier (e.g., logistic regression), visualize performance, and explain precision/recall trade-offs.",
      },
      {
        id: 4,
        title: "Assignment 4: Model Evaluation & Validation",
        marks: 10,
        intro:
          "Use train/validation/test splits and cross-validation to compare models fairly and avoid data leakage.",
      },
      {
        id: 5,
        title: "Assignment 5: Regularization & Overfitting",
        marks: 10,
        intro:
          "Experiment with L1/L2 regularization, tune hyperparameters, and justify your final model selection.",
      },
    ],
    finalExam: {
      title: "Final Exam",
      marks: 50,
      minToPass: 20,
      intro:
        "A comprehensive exam covering core concepts (supervised learning, evaluation, and regularization). It includes short questions and problem-solving; clear reasoning and correct interpretation of results are expected.",
    },
    grading: [
      { range: "50–60", grade: "Grade 1" },
      { range: "60–70", grade: "Grade 2" },
      { range: "70–80", grade: "Grade 3" },
      { range: "80–90", grade: "Grade 4" },
      { range: "> 90", grade: "Grade 5" },
    ],
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

        <section aria-label="Course information">
          <h2 className="sectionTitle">Course Information</h2>
          <div className="card">
            <h3 className="moduleTitle">About this course</h3>
            <p className="moduleDesc">
              Machine Learning (ML) is a field of AI that enables computers to learn patterns from data and make predictions or decisions
              without being explicitly programmed. In this course, you will build a strong foundation in supervised learning, with practical
              experience in regression and classification.

              You will learn how to prepare datasets, engineer features, split data correctly (train/validation/test), and train baseline models.
              The course also emphasizes how to evaluate models using the right metrics (MSE/MAE for regression; accuracy, precision, recall,
              and F1-score for classification) and how to avoid common issues like overfitting and data leakage.

              Course contents include: supervised learning basics, regression analysis, classification algorithms, evaluation metrics, and
              regularization techniques. The module list below provides the structured learning path and practice activities.
            </p>
            <div className="moduleMeta">
              <div className="metaItem">
                <Clock size={16} />
                <span>Estimated study time: 12 hours/week</span>
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

        <section aria-label="Assessment and grading">
          <h2 className="sectionTitle">Assessment &amp; Grading</h2>

          <div className="assessmentGrid">
            <div className="card assessmentAssignments">
              <h3 className="assessmentTitle">Assignments (5 × 10 marks)</h3>
              <div className="assessmentList" role="list">
                {assessments.assignments.map((a) => (
                  <div key={a.id} className="assessmentItem" role="listitem">
                    <div className="assessmentItemTop">
                      <div className="assessmentItemName">{a.title}</div>
                      <span className="markTag">{a.marks} marks</span>
                    </div>
                    <div className="assessmentItemIntro">{a.intro}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card assessmentBreakdown">
              <div className="assessmentHeader">
                <h3 className="assessmentTitle">Assessment Breakdown</h3>
                <span className="markTag">Total: 100 marks</span>
              </div>

              <p className="mutedText">
                The course is assessed through 5 assignments (10 marks each) and a final exam (50 marks).
              </p>

              <div className="noteBox" role="note">
                <div className="noteTitle">Pass requirement</div>
                <div className="noteText">
                  You must score at least <strong>{assessments.finalExam.minToPass}</strong> marks in the final exam to pass the course.
                </div>
              </div>
            </div>

            <div className="card assessmentFinal">
              <div className="assessmentHeader">
                <h3 className="assessmentTitle">Final Exam</h3>
                <span className="markTag">{assessments.finalExam.marks} marks</span>
              </div>
              <p className="assessmentItemIntro">{assessments.finalExam.intro}</p>
              <p className="mutedText">Minimum required to pass: {assessments.finalExam.minToPass} marks.</p>
            </div>

            <div className="card assessmentGrading">
              <h3 className="assessmentTitle">Grading Criteria</h3>
              <div className="mutedText">Final grade is based on the total marks out of 100.</div>
              <div className="tableWrap" role="region" aria-label="Grading criteria table" tabIndex={0}>
                <table className="gradingTable">
                  <thead>
                    <tr>
                      <th scope="col">Total marks</th>
                      <th scope="col">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.grading.map((g) => (
                      <tr key={g.grade}>
                        <td>{g.range}</td>
                        <td>{g.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseContent;
