// Run this script with: node test-ollama.js
import fetch from 'node-fetch';

const testOllamaConnection = async () => {
  console.log('Testing Ollama connection...');
  
  try {
    // Test 1: Check if Ollama server is running
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error('Ollama server is not running');
    }
    console.log('✅ Ollama server is running');

    // Test 2: Check if codellama model is available
    const { models } = await response.json();
    const hasCodeLlama = models.some(model => model.name.includes('codellama'));
    if (!hasCodeLlama) {
      console.log('⚠️ codellama model not found. Please run: ollama pull codellama:7b');
    } else {
      console.log('✅ codellama model is available');
    }

    // Test 3: Test model generation
    console.log('\nTesting model generation...');
    const generateResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'codellama:7b',
        prompt: 'Write a simple hello world function in JavaScript',
        stream: false,
      }),
    });

    if (!generateResponse.ok) {
      throw new Error('Model generation failed');
    }

    const result = await generateResponse.json();
    console.log('\nModel response:');
    console.log(result.response);
    console.log('\n✅ Model generation test passed');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure Ollama is installed');
    console.log('2. Check if Ollama service is running');
    console.log('3. Verify the model is pulled: ollama pull codellama:7b');
    console.log('4. Check if port 11434 is available');
  }
};

// Run the test
testOllamaConnection(); 