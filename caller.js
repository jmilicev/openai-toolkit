const https = require('https');
const path = require('path');
const axios = require('axios');
const { get } = require('http');

const validModels = [
  'gpt-4',
  'gpt-4-32k',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  ];


const startDelimiter = '{"content":"';
const endDelimiter = '"}';
const gpt35turbo_RATE = 0.000002; //per 1 token

function estimateTokenCount(text) {
  //according to OpenAI, each token is approximately 4 characters
  return Math.round(text.length / 4);
}

function getAnalytics(trtoken, rctoken){
  totaltokens = trtoken + rctoken;
  const priceinCENTS = totaltokens * gpt35turbo_RATE * 100;
  
  analytics = '\n\n -- analytics --\n' +
    "prompt tokens spent: " + trtoken + '\n' +
    "completion tokens spent: " + rctoken + '\n' +
    "total tokens spent: " + totaltokens + '\n' +
    "estimated cost: ¢" + priceinCENTS.toFixed(3) + '\n' +
    ' ---- ---- ---- \n';

    return analytics;
}

function validParameters(input, temperature, maxTokens, modelType, PARAMETERS, apiKey){
  if (input === '') {
    console.error('\nERROR: cannot have empty message\n');
    return false;
  }
  if (temperature > 1 || temperature < 0) {
    console.error('ERROR: temperature must be between 0 and 1 inclusive');
    return false ;
  }
  if (maxTokens < 1) {
    console.error('ERROR: max tokens cannot be 0 or negative');
    return false;
  }

  if(!validModels.includes(modelType)){
    console.error("ERROR: model is not a valid option\noptions: gpt-4, gpt-4-32k, gpt-3.5-turbo, gpt-3.5-turbo-16k");
    return false;
  }
  if(!apiKey.includes("sk-")){
    console.error("API key does not appear to be valid. The key should start with 'sk-' ")
    return false
  }
  
  return true;
}

function callAPISustained(messages, temperature, maxTokens, modelType, PARAMETERS, apiKey){
  return new Promise((resolve, reject) => {

    if(!validParameters("PLACEHOLDER", temperature, maxTokens, modelType, PARAMETERS, apiKey)){
      return;
    }

    const data = {
      model: modelType,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    };

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (
            response.choices &&
            response.choices.length > 0 &&
            response.choices[0].message &&
            response.choices[0].message.content
          ) {
            const completion = response.choices[0].message.content;
            resolve(completion);
          } else {
            reject('Unable to retrieve completion from the server response.');
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

function callAPIStatic(input, temperature, maxTokens, modelType, PARAMETERS, apiKey) {
  return new Promise((resolve, reject) => {

    if(!validParameters(input, temperature, maxTokens, modelType, PARAMETERS, apiKey)){
      return;
    }

    if(input.includes(';;;;;')){
      var instructions = input.split(";;;;;");
    }else{
      var instructions = [input, ""];
    }

    const data = {
      model: modelType,
      messages: [
        {
          role: 'user',
          content: instructions[0],
        },  {
          role: 'system',
          content: instructions[1],
        }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
    };

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (
            response.choices &&
            response.choices.length > 0 &&
            response.choices[0].message &&
            response.choices[0].message.content
          ) {
            const completion = response.choices[0].message.content;

            var analytics = "";

            if(PARAMETERS.includes("A") || PARAMETERS.includes("a")){
            trtoken = estimateTokenCount(input);
            rctoken = estimateTokenCount(completion);
            analytics = getAnalytics(trtoken, rctoken);
            }
            
            var header = "";
            if (!PARAMETERS.includes("s")) {
              header += "\n -- GPT: --\n";
              header += "temp = " + temperature + " | m-t = " + maxTokens + " | mdl = " + modelType + "\n\n";
            }


            resolve(header+completion+analytics);
          } else {
            reject('Unable to retrieve completion from the server response.');
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

function callAPI(input, temperature, maxTokens, modelType, PARAMETERS, apiKey, onData, onEnd) {

  if(!validParameters(input, temperature, maxTokens, modelType, PARAMETERS, apiKey)){
    onData("Some of the parameters provided are not correct, check the error and try again.")
    return;
  }

  if(input.includes(';;;;;')){
    var instructions = input.split(";;;;;");
  }else{
    var instructions = [input, ""];
  }
  
  var rctoken = 0;
  var trtoken = 0;

  var filebuilder = ""
  var potentialErrorString = "";

  const req = https.request(
    {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${apiKey}`,
      }
    },
    function (res) {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk.toString();
        potentialErrorString += responseData;

        while (responseData.indexOf(startDelimiter) !== -1 && responseData.indexOf(endDelimiter) !== -1) {
          const startIndex = responseData.indexOf(startDelimiter) + startDelimiter.length;
          const endIndex = responseData.indexOf(endDelimiter, startIndex);

          if (startIndex !== -1 && endIndex !== -1) {
            const content = responseData.substring(startIndex, endIndex);
            const output = content.replace(/\\n/g, '\n');
            rctoken++;
            filebuilder+=output;
            onData(output);
            responseData = responseData.substring(endIndex + endDelimiter.length);
          } else {
            break;
          }
        }
      });

      res.on('end', () => {
        if (PARAMETERS.includes("e")) {
          onData(" %^& END");
        }

        const totaltokens = rctoken + trtoken;
        const priceinCENTS = totaltokens * gpt35turbo_RATE * 100;

        if (rctoken === 0) {
          const error = "\n\nERROR DETECTED: \nLIKELY API KEY / API ISSUE\n\n" + potentialErrorString + "\n\n\nEND ERROR";
          onData(error);
        } else if (PARAMETERS.includes("a") || PARAMETERS.includes("A")) {
          trtoken = estimateTokenCount(input);
          const analytics = getAnalytics(trtoken, rctoken);
          onData(analytics);
        } else {
          if (!PARAMETERS.includes("s")) {
            onData('\n\n ---- ---- ----  ----  ----  ---- \n\n');
          }
        }
        onEnd();
      });
    }
  );

  req.on('error', (e) => {
    onData("Problem with request" + e);
  });

  function processCall() {

    var body = JSON.stringify({
      messages: [
        {
          role: 'user',
          content: instructions[0],
        },  {
          role: 'system',
          content: instructions[1],
        }
      ],
      model: modelType,
      temperature: temperature,
      max_tokens: maxTokens,
      stream: true
    });

    if (!PARAMETERS.includes("s")) {
      onData("\n -- GPT: --\n");
      onData("temp = " + temperature + " | m-t = " + maxTokens + " | mdl = " + modelType + "\n\n");
    }
    req.write(body);
    req.end();
  }

  processCall();
}

module.exports = {
  call: callAPI,
  callStatic: callAPIStatic,
  callSustained: callAPISustained
};
