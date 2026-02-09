// monitoring.js
// Monitoring and logging system (skeleton)

let monitoringData = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalResponseTime: 0,
  errors: [],
  performanceMetrics: {},
  startTime: new Date(),
};

// Log error
export const logError = (errorType, errorMessage, context = {}) => {
  const error = {
    timestamp: new Date().toISOString(),
    type: errorType,
    message: errorMessage,
    context,
  };

  monitoringData.errors.push(error);

  // Keep only last 100 errors
  if (monitoringData.errors.length > 100) {
    monitoringData.errors.shift();
  }

  console.error(`[ERROR] ${errorType}: ${errorMessage}`, context);
};

// Track API request
export const trackRequest = (endpoint, method, statusCode, responseTime) => {
  monitoringData.totalRequests += 1;

  if (statusCode >= 200 && statusCode < 400) {
    monitoringData.successfulRequests += 1;
  } else {
    monitoringData.failedRequests += 1;
  }

  monitoringData.totalResponseTime += responseTime;

  // Track per-endpoint
  const key = `${method} ${endpoint}`;
  if (!monitoringData.performanceMetrics[key]) {
    monitoringData.performanceMetrics[key] = {
      calls: 0,
      totalTime: 0,
      errors: 0,
    };
  }

  monitoringData.performanceMetrics[key].calls += 1;
  monitoringData.performanceMetrics[key].totalTime += responseTime;

  if (statusCode >= 400) {
    monitoringData.performanceMetrics[key].errors += 1;
  }
};

