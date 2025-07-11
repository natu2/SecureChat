const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  pollingInterval: parseInt(process.env.REACT_APP_POLLING_INTERVAL) || 5000,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development'
};

export default API_CONFIG; 