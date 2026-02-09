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

// Get monitoring data
export const getMonitoringData = () => {
  const uptime = new Date() - monitoringData.startTime;
  const averageResponseTime =
    monitoringData.totalRequests > 0
      ? Math.round(monitoringData.totalResponseTime / monitoringData.totalRequests)
      : 0;

  const successRate =
    monitoringData.totalRequests > 0
      ? Math.round((monitoringData.successfulRequests / monitoringData.totalRequests) * 100)
      : 0;

  // Calculate endpoint metrics
  const endpoints = Object.entries(monitoringData.performanceMetrics).map(([key, data]) => ({
    endpoint: key,
    calls: data.calls,
    averageTime: Math.round(data.totalTime / data.calls),
    errors: data.errors,
    errorRate: Math.round((data.errors / data.calls) * 100),
  }));

  return {
    uptime: Math.round(uptime / 1000), // seconds
    totalRequests: monitoringData.totalRequests,
    successfulRequests: monitoringData.successfulRequests,
    failedRequests: monitoringData.failedRequests,
    successRate,
    averageResponseTime,
    recentErrors: monitoringData.errors.slice(-10),
    endpoints: endpoints.sort((a, b) => b.calls - a.calls),
  };
};

// Health check
export const healthCheck = async () => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round((new Date() - monitoringData.startTime) / 1000),
    metrics: {
      totalRequests: monitoringData.totalRequests,
      successRate: monitoringData.totalRequests > 0
        ? Math.round((monitoringData.successfulRequests / monitoringData.totalRequests) * 100)
        : 0,
      averageResponseTime: monitoringData.totalRequests > 0
        ? Math.round(monitoringData.totalResponseTime / monitoringData.totalRequests)
        : 0,
      recentErrors: monitoringData.errors.length,
    },
  };
