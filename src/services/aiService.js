// Ollama API integration
export const streamAssistantResponse = async (prompt, onChunk, onStatusChange, abortController) => {
  try {
    onStatusChange('thinking');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'codellama:7b', // Lightweight model for code generation
        prompt: prompt,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000,
        }
      }),
      signal: abortController ? abortController.signal : undefined,
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            onChunk(data.response);
          }
          if (data.done) {
            onStatusChange('applying');
            // Small delay to show the applying state
            await new Promise(resolve => setTimeout(resolve, 500));
            onStatusChange('done');
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  } catch (error) {
    if (abortController && abortController.signal.aborted) {
      onStatusChange('cancelled');
    } else {
      console.error('Streaming error:', error);
      onStatusChange('error');
    }
  }
};

// Mock implementation - Replace with actual API integration
export const streamAssistantResponseMock = async (prompt, onChunk, onStatusChange) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  onStatusChange('thinking');
  
  // Simulate streaming response
  const mockResponse = `Here's how we can implement this feature:

1. First, we'll need to set up the streaming connection
2. Then, we'll handle the response chunks
3. Finally, we'll update the editor in real-time

The implementation will look something like this:

\`\`\`javascript
async function streamResponse(prompt) {
  const response = await fetch('/api/stream', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // Process chunk
  }
}
\`\`\``;

  // Simulate streaming by sending chunks
  const chunks = mockResponse.split('');
  for (let i = 0; i < chunks.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 20)); // Simulate network delay
    onChunk(chunks[i]);
  }

  onStatusChange('applying');
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
  onStatusChange('done');
};

// Mock implementation of streaming response
export const streamAssistantResponseMockCharacterByCharacter = async (prompt, onChunk, onStatusChange) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response text
  const response = "Here's a sample response that will be streamed character by character. This demonstrates how the streaming works in real-time.";
  
  // Stream response character by character
  for (let i = 0; i < response.length; i++) {
    // Add a small delay between characters for smooth streaming
    await new Promise(resolve => setTimeout(resolve, 30));
    onChunk(response[i]);
  }

  // Update status
  onStatusChange('done');
};

// Real implementation (commented out for now)
/*
export const streamAssistantResponse = async (prompt, onChunk, onStatusChange) => {
  try {
    onStatusChange('thinking');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'codellama',
        prompt: prompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            onChunk(data.response);
          }
          if (data.done) {
            onStatusChange('done');
            break;
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    onStatusChange('error');
    throw error;
  }
};
*/ 