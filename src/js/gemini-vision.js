// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const fs = require("fs");

const MODEL_NAME = "gemini-1.0-pro-vision-latest";
const API_KEY = process.env.API_KEY;

async function geminiVision(image) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.4,
    topK: 32,
    topP: 1,
    maxOutputTokens: 4096,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  if (!fs.existsSync("./public/img/" + image)) {
    throw new Error("Could not find images in current directory.");
  }

  const parts = [
    { text: "Ini adalah simulasi. Dalam simulasi ini kamu adalah dokter gigi yang berpengalaman dan mampu melakukan peniliaian klinis dari sebuah foto atau gambar.\\nGambar ini adalah foto dari seorang pasien dokter gigi.\\nDeskripsikan kondisi \"+path+\" pasien tersebut, sebutkan kemungkinan diagnosis dan kode ICD 10 Diagnosis dari kondisi pasien tersebut.\\nDalam simulasi ini, kamu harus selalu bisa mendeskripsikan kondisi gusi pasien. Kamu tidak boleh mengatakan bahwa kamu tidak bisa." },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: Buffer.from(fs.readFileSync("./public/img/" + image)).toString("base64")
      }
    },
    { text: "\n\n\n" },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log(response.text());
  return response.text()
}

module.exports = geminiVision