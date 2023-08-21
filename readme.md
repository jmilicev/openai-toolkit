# openai-toolkit

This module provides a simple API wrapper for OpenAI's GPT. The module exports three primary functions: `callAPI`, `callAPIStatic`, and `callAPISustained`.

---

## Table of Contents
- [Setup](#setup)
- [Functions](#functions)
  - [callAPI](#callapi)
  - [callAPIStatic](#callapistatic)
  - [callAPISustained](#callapisustained)
- [Additional Utilities](#additional-utilities)

---

## Setup

1. Ensure that you have the following Node.js modules installed:
    - `https`
    - `path`
    - `axios`
    - `http`

2. import openai-toolkit:
   ```javascript
   const { callAPI, callAPIStatic, callAPISustained } = require('openai-toolkit');
   ```

---

## Functions

### callAPI

**Parameters:**

- `input`: The text input you wish to send to the API.
- `temperature`: The temperature setting, which should be between 0 and 1. A higher value makes the output more random, while a lower value makes it more deterministic.
- `maxTokens`: The maximum number of tokens for the response.
- `modelType`: The model type you wish to use (e.g., "gpt-4").
- `PARAMETERS`: Parameters to determine the format of the response. Possible values include:
  - "A"/"a": Adds analytics data to the output.
  - "s": Streamlines the output without any headers or separators.
  - "e": Adds an "END" marker to the output.
- `apiKey`: Your OpenAI API key.
- `onData`: A callback function that will receive chunks of data as they come in.
- `onEnd`: A callback function that will be called when the data transmission is complete.

### callAPIStatic

This function calls the OpenAI API with a single static input and returns a completion.

**Parameters:**

- `input`: The text input you wish to send to the API.
- `temperature`: Temperature setting for the API.
- `maxTokens`: Maximum token count for the response.
- `modelType`: Model type (e.g., "gpt-4").
- `PARAMETERS`: Parameters for output format.
- `apiKey`: Your OpenAI API key.

### callAPISustained

This function offers a sustained conversation with the OpenAI model.

**Parameters:**

- `messages`: An array of message objects, each having a `role` (either "user" or "system") and a `content` (the message content).
- `temperature`: Temperature setting for the API.
- `maxTokens`: Maximum token count for the response.
- `modelType`: Model type (e.g., "gpt-4").
- `PARAMETERS`: Parameters for output format.
- `apiKey`: Your OpenAI API key.

---

## Additional Utilities

- `validParameters`: Checks whether the provided parameters are valid or not.
- `estimateTokenCount`: Estimates the token count based on text length. Each token is approximately 4 characters.
- `getAnalytics`: Generates an analytics string based on token counts and costs.

---

**Note**: Remember to always keep your API key confidential and never expose it directly in the code. Consider using environment variables or a configuration management solution. Always handle errors gracefully, and be aware of rate limits and costs associated with API calls.
