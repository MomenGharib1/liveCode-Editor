const config = {
  development: {
    ollamaEndpoint: 'http://localhost:11434',
  },
  production: {
    // In production, we'll use a proxy to forward requests to the local Ollama instance
    ollamaEndpoint: '/api/ollama',
  },
};

export default config[process.env.NODE_ENV || 'development']; 