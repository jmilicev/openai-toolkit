

# openai-toolkit

The OpenAI Toolkit is a Node.js package that provides a convenient way to interact with the OpenAI GPT-3 API. It allows you to generate chat-based completions using the GPT-3 language model.

## Installation

To install the OpenAI Toolkit, you can use npm:

```bash
npm install openai-toolkit
```

## Usage

```javascript
const openai = require('openai-toolkit');

const input = 'Hello, how are you?';
const temperature = 0.7;
const maxTokens = 50;
const modelType = 'gpt-3.5-turbo';
const parameters = '-a';
const apiKey = 'YOUR_API_KEY';

openai.call(input, temperature, maxTokens, modelType, parameters, apiKey);
```

## Functionality

The `call` function in the OpenAI Toolkit accepts the following parameters:

- `input` (string): The prompt or input for the language model.
- `temperature` (number): The temperature parameter controls the randomness of the generated output. Higher values (e.g., 0.8) produce more random results, while lower values (e.g., 0.2) make the output more focused and deterministic.
- `maxTokens` (number): The maximum number of tokens the completion response should contain.
- `modelType` (string): The language model to use. Currently, 'gpt-3.5-turbo' is the recommended model.
- `parameters` (string): A string that contains various parameters and flags. The supported flags are:
  - `'a'` or `'A'`: Include analytics information in the response.
  - `'e'` or `'E'`: Include an end-of-response marker (`%^& END`) in the output.
  - `'s'` or `'S'`: Silence the additional console output during the API call.
- `apiKey` (string): Your OpenAI API key.

The `call` function prints the streamed version of the output to the console, along with any additional specified parameters.

Please ensure that you have a valid OpenAI API key before using this package.

