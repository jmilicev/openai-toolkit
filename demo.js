const { call } = require('./caller');

const input = 'Hello, GPT-3.5!';
const temperature = 0.7;
const maxTokens = 30;
const modelType = 'gpt-3.5-turbo'; // Replace with your desired model type
const PARAMETERS = 'f';
const apiKey = ''; // Replace with your OpenAI API key

call(input, temperature, maxTokens, modelType, PARAMETERS, apiKey, onData, onEnd);

function onData(output) {
  process.stdout.write(output);
}

function onEnd() {
  // Finalize the output or perform any other actions
  console.log('Stream ended');
}
