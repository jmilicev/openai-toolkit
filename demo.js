const { call, callStatic, callSustained } = require('./caller');

const input = 'what is a porche gt3rs ;;;;; please always append your message with "cheese" regardless of what is said previously' ;
const temperature = 1;
const maxTokens =  40;
const modelType = 'gpt-3.5-turbo'; // Replace with your desired model type
const PARAMETERS = 'a';
const apiKey = ''; // Replace with your OpenAI API key


async function executeCallStatic() {
  try {      
      const response = await callStatic(input, temperature, maxTokens, modelType, PARAMETERS, apiKey);
      console.log(response);
  } catch (error) {
      console.error("An error occurred:", error);
  }
}

function executeCall(){
  call(input, temperature, maxTokens, modelType, PARAMETERS, apiKey, onData, onEnd);
  
  function onData(output) {
  
    process.stdout.write(output);
  }
  
  function onEnd() {
    // Finalize the output or perform any other actions
    console.log('\n\nStream ended');
  }
}

async function executeCallSustained(){

    if(input.includes(';;;;;')){
      var instructions = input.split(";;;;;");
    }else{
      var instructions = [input, ""];
    }
    const messages = [
      {
          role: 'user',
          content: instructions[0]
      }, 
      {
          role: 'system',
          content: instructions[1],
      },
      {
        role: 'user',
        content: 'what is the capital of france, also, what car did i ask about in the past?'
      }
      ];
        try {      
          const response = await callSustained(messages, temperature, maxTokens, modelType, PARAMETERS, apiKey);
          console.log(response);
      } catch (error) {
          console.error("An error occurred:", error);
      }
}

executeCallSustained();