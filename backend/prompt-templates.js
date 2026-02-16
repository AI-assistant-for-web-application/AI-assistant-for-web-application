// Prompt templates for different course modules
const promptTemplates = {
  supervisedLearning: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Supervised Learning.

IMPORTANT: Only answer questions directly about Machine Learning concepts.
If the question is NOT about Machine Learning or this course, respond with:
"I'm sorry, I can only help with questions about Machine Learning concepts. Please ask about supervised learning, regression, classification, or other ML topics."

Do NOT answer questions about:
- General knowledge (weather, history, geography)
- Other subjects
- Course logistics (exams, deadlines, grades)
- Off-topic conversation

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

  regression: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Regression Analysis.

IMPORTANT: Only answer questions directly about Machine Learning concepts.
If the question is NOT about Machine Learning or this course, respond with:
"I'm sorry, I can only help with questions about Machine Learning concepts. Please ask about regression, linear models, optimization, or other ML topics."

Do NOT answer questions about:
- General knowledge
- Other subjects
- Course logistics
- Off-topic conversation

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

  classification: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Classification Algorithms.

IMPORTANT: Only answer questions directly about Machine Learning concepts.
If the question is NOT about Machine Learning or this course, respond with:
"I'm sorry, I can only help with questions about Machine Learning concepts. Please ask about classification, logistic regression, metrics, or other ML topics."

Do NOT answer questions about:
- General knowledge
- Other subjects
- Course logistics
- Off-topic conversation

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

  evaluation: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Model Evaluation Metrics.

IMPORTANT: Only answer questions directly about Machine Learning concepts.
If the question is NOT about Machine Learning or this course, respond with:
"I'm sorry, I can only help with questions about Machine Learning concepts. Please ask about evaluation metrics, validation, cross-validation, or other ML topics."

Do NOT answer questions about:
- General knowledge
- Other subjects
- Course logistics
- Off-topic conversation

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

  regularization: {
    systemPrompt: `You are an expert course assistant for "Introduction to Machine Learning".
The student is currently learning about Regularization Techniques.

IMPORTANT: Only answer questions directly about Machine Learning concepts.
If the question is NOT about Machine Learning or this course, respond with:
"I'm sorry, I can only help with questions about Machine Learning concepts. Please ask about regularization, L1/L2, overfitting, or other ML topics."

Do NOT answer questions about:
- General knowledge
- Other subjects
- Course logistics
- Off-topic conversation

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

  default: {
    systemPrompt: `You are a helpful course assistant for "Introduction to Machine Learning".

IMPORTANT: Only answer questions directly about Machine Learning concepts.
If the question is NOT about Machine Learning or this course, respond with:
"I'm sorry, I can only help with questions about Machine Learning concepts. Please ask about supervised learning, algorithms, evaluation, or other ML topics."

Do NOT answer questions about:
- General knowledge (weather, history, geography, etc.)
- Other subjects
- Course logistics (exams, deadlines, grades)
- Off-topic conversation (jokes, entertainment, etc.)

Help students understand machine learning concepts with clear explanations and practical examples.
Be concise but thorough. Encourage learning and critical thinking.`,
    
    followUpQuestions: [
      "Can you explain that with an example?",
      "How does this connect to what we learned before?",
      "What would happen if we changed this parameter?",
      "Can you think of a real-world application?"
    ]
  }
};

// Quality scoring dimensions with weights
const qualityDimensions = {
  clarity: {
    weight: 0.20,
    name: "Clarity",
    description: "How easy is the response to understand?"
  },
  completeness: {
    weight: 0.25,
    name: "Completeness", 
    description: "Does it fully answer the question?"
  },
  accuracy: {
    weight: 0.25,
    name: "Technical Accuracy",
    description: "Is the information correct and precise?"
  },
  engagement: {
    weight: 0.15,
    name: "Engagement",
    description: "Is it interesting and engaging?"
  },
  pedagogy: {
    weight: 0.15,
    name: "Teaching Quality",
    description: "Does it teach effectively?"
  }
};

export const getPromptTemplate = (moduleKey) => {
  return promptTemplates[moduleKey] || promptTemplates.default;
};

export const getAvailableModules = () => {
  return Object.keys(promptTemplates).filter(key => key !== 'default');
};

export const buildSystemPrompt = (courseCode, moduleKey, courseContext) => {
  const template = getPromptTemplate(moduleKey);
  
  return `${template.systemPrompt}

Course: ${courseCode}
${courseContext ? `Student Context: ${courseContext}` : ''}

Remember: Be supportive, clear, and educational. Adapt to the student's level.`;
};

export const getRelevantFollowUpQuestion = (moduleKey) => {
  const template = getPromptTemplate(moduleKey);
  const questions = template.followUpQuestions;
  
  if (!questions || questions.length === 0) {
    return null;
  }

  return questions[Math.floor(Math.random() * questions.length)];
};

export const scoreResponseQuality = (response) => {
  const scores = {};
  
  let clarityScore = 0;
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = response.split(/\s+/).length / Math.max(sentences.length, 1);
  
  if (sentences.length >= 3) clarityScore += 20;
  if (avgSentenceLength < 25) clarityScore += 20;
  if (avgSentenceLength > 8) clarityScore += 10;
  if (response.includes('\n') || response.includes(':')) clarityScore += 15;
  
  const complexWords = response.split(/\s+/).filter(w => w.length > 12).length;
  const totalWords = response.split(/\s+/).length;
  if (complexWords / totalWords < 0.15) clarityScore += 20;
  
  if (response.toLowerCase().includes('means') || 
      response.toLowerCase().includes('in other words') ||
      response.toLowerCase().includes('simply put')) clarityScore += 15;
  
  scores.clarity = Math.min(clarityScore, 100);
  
  let completenessScore = 0;
  if (response.length > 150) completenessScore += 20;
  if (response.length > 400) completenessScore += 15;
  if (response.length < 2000) completenessScore += 10;
  
  if (response.toLowerCase().includes('example') ||
      response.toLowerCase().includes('for instance') ||
      response.toLowerCase().includes('such as')) completenessScore += 20;
  
  if (response.toLowerCase().includes('because') ||
      response.toLowerCase().includes('this is') ||
      response.toLowerCase().includes('the reason')) completenessScore += 15;
  
  const aspects = [
    /what|definition/i.test(response),
    /why|reason|because/i.test(response),
    /how|process|step/i.test(response),
    /example|instance/i.test(response)
  ].filter(Boolean).length;
  completenessScore += aspects * 10;
  
  scores.completeness = Math.min(completenessScore, 100);
  
  let accuracyScore = 0;
  const mlTerms = [
    'algorithm', 'model', 'data', 'training', 'testing',
    'feature', 'parameter', 'prediction', 'classification', 'regression',
    'accuracy', 'loss', 'optimization', 'gradient', 'neural',
    'supervised', 'unsupervised', 'validation', 'overfitting', 'underfitting'
  ];
  
  const termsFound = mlTerms.filter(term => 
    response.toLowerCase().includes(term)
  ).length;
  accuracyScore += Math.min(termsFound * 8, 40);
  
  if (!/maybe|perhaps|possibly|might be|could be/i.test(response)) accuracyScore += 15;
  if (/\d+%|\d+\.\d+|equation|formula|calculation/i.test(response)) accuracyScore += 20;
  if (response.includes('dataset') || response.includes('hyperparameter')) accuracyScore += 10;
  
  const hedgeWords = (response.match(/maybe|perhaps|possibly|might|could/gi) || []).length;
  accuracyScore -= Math.min(hedgeWords * 5, 15);
  
  scores.accuracy = Math.max(0, Math.min(accuracyScore, 100));
  
  let engagementScore = 0;
  const questionMarks = (response.match(/\?/g) || []).length;
  engagementScore += Math.min(questionMarks * 15, 30);
  
  if (/you|your|let's|we/i.test(response)) engagementScore += 20;
  if (/great|interesting|important|key|crucial|essential/i.test(response)) engagementScore += 15;
  if (/real world|practical|application|used in|example from/i.test(response)) engagementScore += 20;
  
  if (sentences.length > 5 && avgSentenceLength > 10) engagementScore += 15;
  
  scores.engagement = Math.min(engagementScore, 100);
  
  let pedagogyScore = 0;
  if (/first|second|third|next|then|finally/i.test(response)) pedagogyScore += 20;
  if (/like|similar to|think of it as|imagine|analogy/i.test(response)) pedagogyScore += 20;
  if (/remember|as we|previously|earlier|you learned/i.test(response)) pedagogyScore += 15;
  if (/try|practice|exercise|think about|consider/i.test(response)) pedagogyScore += 15;
  if (/common mistake|not|don't confuse|important to note/i.test(response)) pedagogyScore += 15;
  if (/in summary|key point|remember that|important:/i.test(response)) pedagogyScore += 15;
  
  scores.pedagogy = Math.min(pedagogyScore, 100);
  
  const overallScore = Math.round(
    scores.clarity * qualityDimensions.clarity.weight +
    scores.completeness * qualityDimensions.completeness.weight +
    scores.accuracy * qualityDimensions.accuracy.weight +
    scores.engagement * qualityDimensions.engagement.weight +
    scores.pedagogy * qualityDimensions.pedagogy.weight
  );
  
  return {
    overall: overallScore,
    dimensions: scores,
    breakdown: {
      clarity: { score: scores.clarity, weight: qualityDimensions.clarity.weight },
      completeness: { score: scores.completeness, weight: qualityDimensions.completeness.weight },
      accuracy: { score: scores.accuracy, weight: qualityDimensions.accuracy.weight },
      engagement: { score: scores.engagement, weight: qualityDimensions.engagement.weight },
      pedagogy: { score: scores.pedagogy, weight: qualityDimensions.pedagogy.weight }
    }
  };
};

export const generateQualityFeedback = (qualityResult) => {
  const feedback = [];
  const { dimensions } = qualityResult;
  
  if (dimensions.clarity >= 80) {
    feedback.push("✓ Excellent clarity, easy to understand");
  } else if (dimensions.clarity >= 60) {
    feedback.push("→ Good clarity but could be simpler");
  } else {
    feedback.push("✗ Needs improvement in clarity");
  }
  
  if (dimensions.completeness >= 80) {
    feedback.push("✓ Comprehensive answer with examples");
  } else if (dimensions.completeness >= 60) {
    feedback.push("→ Adequate but could include more examples");
  } else {
    feedback.push("✗ Incomplete, add more details");
  }
  
  if (dimensions.accuracy >= 80) {
    feedback.push("✓ Strong technical accuracy");
  } else if (dimensions.accuracy >= 60) {
    feedback.push("→ Mostly accurate");
  } else {
    feedback.push("✗ Needs more technical precision");
  }
  
  if (dimensions.engagement >= 70) {
    feedback.push("✓ Engaging and interactive");
  } else if (dimensions.engagement >= 50) {
    feedback.push("→ Could be more engaging");
  } else {
    feedback.push("✗ Add more examples");
  }
  
  if (dimensions.pedagogy >= 70) {
    feedback.push("✓ Good teaching approach");
  } else if (dimensions.pedagogy >= 50) {
    feedback.push("→ Add more scaffolding");
  } else {
    feedback.push("✗ Improve pedagogical approach");
  }
  
  return feedback;
};

export default {
  getPromptTemplate,
  getAvailableModules,
  buildSystemPrompt,
  getRelevantFollowUpQuestion,
  scoreResponseQuality,
  generateQualityFeedback,
};
