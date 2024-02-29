// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const runChat = require('./src/js/gemini')
const geminiVision = require('./src/js/gemini-vision')

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4(); // Generate UUID
    const fileExtension = path.extname(file.originalname); // Get file extension
    cb(null, uniqueFilename + fileExtension); // Set UUID as filename
  }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  console.log('GET on /')
  res.sendFile(__dirname + '/src/html/index.html');
});
app.get('/loader.gif', (req, res) => {
  console.log('GET on /loader.gif')
  res.sendFile(__dirname + '/src/assets/loader.gif');
});
app.post('/chat', async (req, res) => {
  console.log('POST on /chat')
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
  console.log('GET on /vision')
  res.sendFile(__dirname + '/src/html/vision.html')
})

// Define a route to handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  console.log('POST on /upload')
  if (req.file) {
    // Extract the filename from req.file
    const filename = req.file.filename;

    // Call geminiVision function with the filename
    const response = await geminiVision(filename);

    // Send response
    res.json({ response });
  } else {
    res.status(400).send('No file uploaded');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});