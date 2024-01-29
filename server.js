const express = require("express")
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express()
const Port = 3000

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'memes')));

app.get("/", async (req, res) => {
    const joke = await getRandomJoke();
    const memePath = getRandomMeme();
    console.log('Meme Path:', memePath);

    res.render('index', { joke: joke, meme: memePath });
});

app.post("/", (req, res) => {
    res.redirect('/')
})

async function getRandomJoke() {
  try {
    const response = await axios.get('https://icanhazdadjoke.com/', {
      headers: { 'Accept': 'application/json' }
    });
    return response.data.joke;
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    return 'Error fetching joke';
  }
}

function getRandomMeme() {
    const memesPath = path.join(__dirname, 'memes');
    const jpegFiles = fs.readdirSync(memesPath).filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'));
    
    if (jpegFiles.length === 0) {
      console.error('No JPEG files found in the "memes" directory.');
      return null;
    }
  
    const randomFileName = jpegFiles[Math.floor(Math.random() * jpegFiles.length)];
    return path.join(memesPath, randomFileName);
  }
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});