const openaiToolkit = require('./caller');
require('dotenv').config();

const APIKEY = process.env.OPENAI_API_KEY;

const INPUT = "what is a crocodile";
const TEMPERATURE = 0.8;
const MAX_TOKENS = 50;
const MODEL_TYPE = "gpt-3.5-turbo";
const ANALYTICS = "-a";

openaiToolkit.call(INPUT, TEMPERATURE, MAX_TOKENS, MODEL_TYPE, ANALYTICS, APIKEY);
