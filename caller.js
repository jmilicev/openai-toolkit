const https = require('https');
const { exec } = require('child_process');

function callAPI(input, temperature, maxTokens, modelType, PARAMETERS, apiKey) {

  var rctoken = 0;
  var trtoken = 0;

  var potentialErrorString = "";

  const startDelimiter = '{"content":"';
  const endDelimiter = '"}';
  const gpt35turbo_RATE = 0.000002; //per 1 token

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
        responseData = chunk.toString();
        potentialErrorString += responseData;
        if (responseData.indexOf("content") != -1) {
          rctoken++;
          const inputString = responseData;

          const startIndex = inputString.indexOf(startDelimiter) + startDelimiter.length;
          const endIndex = inputString.indexOf(endDelimiter, startIndex);

          if (startIndex !== -1 && endIndex !== -1) {
            const content = inputString.substring(startIndex, endIndex);
            const output = content.replace(/\\n/g, '\n');
            process.stdout.write(output);
          } else {
            console.log('Content not found');
          }
        }
      });

      res.on('end', () => {

        if(PARAMETERS.includes("e")){
          process.stdout.write("%^& END");
        }

        const totaltokens = rctoken + trtoken;
        const priceinCENTS = totaltokens * gpt35turbo_RATE * 100;

        if (rctoken == 0) {
          console.log("\n\nERROR DETECTED: ")
          console.log("LIKELY API KEY / API ISSUE\n")
          console.log(potentialErrorString + "\n\n");
          console.log("\n\nEND ERROR")
        } else if (PARAMETERS.includes("a") || PARAMETERS.includes("A")) {
          console.log('\n\n -- analytics --');
          console.log("prompt tokens spent: " + trtoken);
          console.log("completion tokens spent: " + rctoken);
          console.log("total tokens spent: " + (totaltokens))
          console.log("estimated cost: ¢" + priceinCENTS.toFixed(3))
          console.log(' ---- ---- ---- \n');
        } else {
          if(!PARAMETERS.includes("s")){
            console.log('\n\n ---- ---- ----  ----  ----  ---- \n\n');
          }
        }
      });
    }
  );

  req.on('error', (e) => {
    console.error("Problem with request" + e)
  });

  function estimateTokenCount(text) {
    //according to openAI, each token is aprox 4 char
    return Math.round(text.length/4);
  }

  function processCall() {
    if (PARAMETERS == "-a") {
      trtoken = estimateTokenCount(input)
    }
    var body = JSON.stringify({
      messages: [
        {
          role: 'user',
          content: input,
        },
      ],
      model: modelType,
      temperature: temperature,
      max_tokens: maxTokens,
      stream: true
    });

    if(!PARAMETERS.includes("s")){
        console.log("\n -- GPT: --");
        console.log("temp = " + temperature + " | m-t = " + maxTokens + " | mdl = " + modelType + "\n");
    }
    req.write(body);
    req.end();
  }

  processCall();
}

module.exports = {
  call: callAPI
};
