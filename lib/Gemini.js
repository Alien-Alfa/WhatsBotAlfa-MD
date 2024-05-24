const { fromBuffer } = require("file-type");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getJson } = require("../lib/");

require("dotenv").config();

let k1 = "AIzaSyCKRWF"
let k2 = "7qyibMNAa"
let k3 = "qVsUQbYVsIE2-"
let k4 = "FVKBhw"

const GminiAIPKEY = process.env.GEMINI_API === undefined ? k1+k2+k3+k4 :  process.env.GEMINI_API
const genAI = new GoogleGenerativeAI(GminiAIPKEY);


function fileToGenerativePart(buff, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(buff).toString("base64"),
      mimeType,
    },
  };
}

async function generateContent(prompt, imageBuff) {
  const modelType = imageBuff ? "gemini-pro-vision" : "gemini-pro";
  const model = genAI.getGenerativeModel({ model: modelType });
  const result = await model.generateContent([
    prompt,
    fileToGenerativePart(
      imageBuff,
      imageBuff && (await fromBuffer(imageBuff)).mime
    ),
  ]);

  return result.response.text();
}

async function gemini(prompt, imageBuff, options) {
  const { promptText, promptImage } = await getJson(
    `https://gist.githubusercontent.com/Alien-Alfa/f4fdc21d6494ffba045f1b9e2663c20f/raw/6ad95d5359f6b28b6cbed3b82be8cc4683ba88c7/auroraprompt.json`
  );
 
  try {
    if (imageBuff) {
      prompt = promptImage + prompt;
      return await generateContent(prompt, imageBuff);
    } else {
      prompt = promptText + prompt;
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    }
  } catch (error) {
    return error.message.replace("[GoogleGenerativeAI Error]:", "");
  }
}

module.exports = gemini;
