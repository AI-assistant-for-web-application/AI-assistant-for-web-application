// Prompt templates for different course modules
const promptTemplates = {
  // Module 1: Supervised Learning Basics
  supervisedLearning: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Supervised Learning.

Key concepts to reinforce:
- Labeled training data
- Regression vs Classification
- Training and testing datasets
- Model evaluation basics

Guidelines:
- Explain concepts with simple examples
- Use real-world analogies
- Encourage critical thinking
- Correct misconceptions gently`,
    
    followUpQuestions: [
      "Can you explain why we need both training and testing data?",
      "What's the difference between regression and classification?",
      "How do we measure if a supervised model is working well?",
      "What happens if we only use training data for evaluation?"
    ]
  },

  // Module 2: Regression Analysis
  regression: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Regression Analysis.

Key concepts to reinforce:
- Linear regression
- Cost function and optimization
- Overfitting and underfitting
- Feature scaling

Guidelines:
- Explain mathematical concepts with visualizations
- Use real datasets as examples
- Discuss practical implications
- Connect to previous module knowledge`,
    
    followUpQuestions: [
      "Why do we need to minimize the cost function?",
      "How does feature scaling improve regression models?",
      "What causes overfitting in linear regression?",
      "How do regularization techniques prevent overfitting?"
    ]
  },

  // Module 3: Classification Algorithms
  classification: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Classification Algorithms.

Key concepts to reinforce:
- Logistic regression
- Decision boundaries
- Precision, recall, and F1-score
- Confusion matrix

Guidelines:
- Explain classification with clear examples
- Discuss business implications of metrics
- Connect to real-world use cases
- Emphasize metric selection importance`,
    
    followUpQuestions: [
      "Why is logistic regression called 'regression' if it's for classification?",
      "How do we choose between precision and recall?",
      "What does a confusion matrix tell us?",
      "When is accuracy a misleading metric?"
    ]
  },

  // Module 4: Model Evaluation
  evaluation: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Model Evaluation Metrics.

Key concepts to reinforce:
- Train/validation/test splits
- Cross-validation
- ROC curves and AUC
- Hyperparameter tuning

Guidelines:
- Explain evaluation rigorously
- Discuss data leakage risks
- Connect metrics to business goals
- Emphasize proper evaluation procedures`,
    
    followUpQuestions: [
      "Why do we need separate validation and test sets?",
      "How does k-fold cross-validation reduce bias?",
      "What does the ROC curve show us?",
      "How do we avoid data leakage when evaluating?"
    ]
  },

  // Module 5: Regularization
  regularization: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Regularization Techniques.

Key concepts to reinforce:
- L1 and L2 regularization
- Hyperparameter lambda tuning
- Early stopping
- Dropout and other techniques

Guidelines:
- Explain regularization mathematically and intuitively
- Show practical regularization patterns
- Discuss trade-offs clearly
- Connect to overfitting solutions`,
    
    followUpQuestions: [
      "What's the difference between L1 and L2 regularization?",
      "How do we choose the right regularization strength?",
      "Why does regularization help prevent overfitting?",
      "When should we use early stopping?"
    ]
  },

  // Default/General
  default: {
    systemPrompt: `You are a helpful course assistant for "Introduction to Machine Learning".
Help students understand machine learning concepts, answer questions about course material,
and provide clear explanations with practical examples.

Be concise but thorough. Encourage learning and critical thinking.`,
    
    followUpQuestions: [
      "Can you explain that with an example?",
      "How does this connect to what we learned before?",
      "What would happen if we changed this parameter?",
      "Can you think of a real-world application?"
    ]
  }
};

// Get prompt template by module
export const getPromptTemplate = (moduleKey) => {
  return promptTemplates[moduleKey] || promptTemplates.default;
};

// Get all available modules
export const getAvailableModules = () => {
  return Object.keys(promptTemplates).filter(key => key !== 'default');
};

// Build comprehensive system prompt
export const buildSystemPrompt = (courseCode, moduleKey, courseContext) => {
  const template = getPromptTemplate(moduleKey);
  
  return `${template.systemPrompt}

Course: ${courseCode}
${courseContext ? `Student Context: ${courseContext}` : ''}

Remember: Be supportive, clear, and educational. Adapt to the student's level.`;
};

// Get a random follow-up question for a module
export const getRelevantFollowUpQuestion = (moduleKey) => {
  const template = getPromptTemplate(moduleKey);
  const questions = template.followUpQuestions;
  
  if (!questions || questions.length === 0) {
    return null;
  }

  // Return random question for variety
  return questions[Math.floor(Math.random() * questions.length)];
};

// Score response quality
export const scoreResponseQuality = (response) => {
  let score = 0;
  const maxScore = 100;

    if (response.length > 100 && response.length < 2000) {
        score += 20;
    }

    // Criteria 2: Contains examples (good teaching practice)
    if (response.toLowerCase().includes('example') || 
        response.toLowerCase().includes('for instance') ||
        response.toLowerCase().includes('such as')) {
        score += 20;
    }

    // Criteria 3: Clarity (simple words and short sentences)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = response.split(/\s+/);
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);
    
    if (avgSentenceLength < 20) {
        score += 20;
    }

    // Criteria 4: Technical accuracy (has specific ML terms)
    const techTerms = [
        'algorithm', 'model', 'data', 'training', 'testing',
        'feature', 'parameter', 'prediction', 'classification', 'regression',
        'accuracy', 'loss', 'optimization', 'gradient'
    ];
    const hasTechTerms = techTerms.some(term => response.toLowerCase().includes(term));
    
    if (hasTechTerms) {
        score += 20;
    }

    // Criteria 5: Teaching approach (asks questions to engage student)
    if (response.includes('?')) {
        score += 20;
    }

    return Math.min(score, maxScore);
};

export default {
  getPromptTemplate,
  getAvailableModules,
  buildSystemPrompt,
  getRelevantFollowUpQuestion,
};
