const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const clues = [
  { clue: "Illegally acquire metal", answer: "STEAL THE STEEL" },
  // Add more clues here
];

app.get('/clue', (req, res) => {
  const randomClue = clues[Math.floor(Math.random() * clues.length)];
  res.json(randomClue);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());


// Fetch Clues/Answers from Google Sheet
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7uxmvDZrUGOBxyW6VaPe_47WlktrowPtErqX4E76zD8dxKCrTXDOJi2uiOy-3PcGEbIDxZQHW_yD5/pub?gid=0&single=true&output=csv';

// Endpoint to fetch a random clue
app.get('/clue', async (req, res) => {
  try {
    const response = await axios.get(GOOGLE_SHEET_URL);
    const rows = response.data.split('\n').slice(1); // Skip the header row
    const clues = rows.map(row => {
      const [clue, answer] = row.split(',');
      return { clue, answer };
    });
    const randomClue = clues[Math.floor(Math.random() * clues.length)];
    res.json(randomClue);
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    res.status(500).json({ error: 'Failed to fetch clues' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
