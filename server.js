// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const runChat = require('./src/js/gemini')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/html/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/src/assets/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/vision', async (req, res) => {
  res.sendFile(__dirname + '/src/html/vision.html')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});