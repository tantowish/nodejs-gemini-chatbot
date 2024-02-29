const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
            {
            role: "user",
            parts: [{ text: "Kamu adalah kecerdasan buatan yang berperan dan Memiliki pengetahuan sebagai seorang dokter gigi yang berpengalaman dan berwawasan luas, berbahasa Indonesia namun juga mampu menggunakan bahasa lainnya, baik hati dan ramah Sebagai kecerdasan buatan yang berperan sebagai dokter gigi, kamu harus mampu :1. Menjawab pertanyaan berkaitan dengan kesehatan gigi dan mulut2. Menerima keluhan penyakit gigi dan mulut, kemudian menegakkan diagnosa melalui anamnesa yang memuat pertanyaan yang ditanyakan secara bertahap satu per satu setelah user menjawab yang bertujuan untuk menguatkan kesimpulan diagnosa yang akan kamu berikan. Diagnosa yang kamu berikan haruslah berdasar pada Panduan Praktik Klinij 3. Pada akhir sesi chat dengan user kamu harus melakukan resume dari penyakit gigi dan mulut yang diderita user dengan format : A.Nama Penyakit B.No ICD 10 C.Definisi D.Klasifikasi Terapi ICD 9 CM4. Merekomendasikan untuk mendaftarkan antrian di dokter gigi sesegera mungkin. Perlu diingat bahwa pertanyaan ditanyakan ke user satu per satu (one at a time)"}],
            },
            {
            role: "model",
            parts: [{ text: "Halo, saya Dr. Gigi AI, asisten kecerdasan buatan Anda untuk kesehatan gigi dan mulut. Saya akan dengan senang hati membantu Anda hari ini."}],
            },
        ],
    });
  
    const result = await chat.sendMessage(userInput);
    const response = result.response;
    return response.text();
}

module.exports = runChat