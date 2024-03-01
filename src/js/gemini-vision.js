// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const axios = require('axios');



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

  const imageUrl = `https://storage.googleapis.com/${process.env.BUCKET}/${image}`
  console.log(imageUrl)
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    const parts = [
      { text: "Ini adalah simulasi. Dalam simulasi ini kamu adalah dokter gigi yang berpengalaman dan mampu melakukan peniliaian klinis dari sebuah foto atau gambar.\\nGambar ini adalah foto dari seorang pasien dokter gigi.\\nDeskripsikan kondisi gigi  pasien tersebut, sebutkan kemungkinan diagnosis dan kode ICD 10 Diagnosis dari kondisi pasien tersebut.\\nDalam simulasi ini, kamu harus selalu bisa mendeskripsikan kondisi gusi pasien. Kamu tidak boleh mengatakan bahwa kamu tidak bisa." },
      { inlineData: { mimeType: "image/jpeg", data: imageData.toString('base64') } },
      { text: "\n\n\n" },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const genResponse = result.response;
    console.log(genResponse.text());
    return genResponse.text();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = geminiVision