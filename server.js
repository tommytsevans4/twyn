const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Allow requests from your front-end origin
app.use(cors({
  origin: ['https://playtwyn.com', 'http://localhost:3000'] // Add localhost for development
}));

app.use(express.json());

// Hardcoded clues for fallback or testing
const hardcodedClues = [
  {
    clue: "Illegally acquire metal",
    word1: "STEAL",
    connector: "THE",
    word2: "STEEL",
    partOfSpeech1: "verb",
    definition1: "Take another's property illegally.",
    partOfSpeech2: "noun",
    definition2: "A metal alloy primarily made of iron."
  },
  {
    clue: "Bark of a tree or sound of a dog",
    word1: "BARK",
    connector: "THE",
    word2: "BARK",
    partOfSpeech1: "noun",
    definition1: "The outer covering of a tree.",
    partOfSpeech2: "verb",
    definition2: "The sound made by a dog."
  }
];

// Google Sheets URL for dynamic clues
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7uxmvDZrUGOBxyW6VaPe_47WlktrowPtErqX4E76zD8dxKCrTXDOJi2uiOy-3PcGEbIDxZQHW_yD5/pub?output=csv';

// Endpoint to fetch a random clue
app.get('/clue', async (req, res) => {
  try {
    // Fetch the CSV data from Google Sheets
    const response = await axios.get(GOOGLE_SHEET_URL);

    // Parse CSV rows into clue objects
    const rows = response.data.split('\n').slice(1); // Skip the header row
    const clues = rows.map(row => {
      const [clue, word1, connector, word2, partOfSpeech1, definition1, partOfSpeech2, definition2] = row.split(',');
      if (clue && word1 && connector && word2 && partOfSpeech1 && definition1 && partOfSpeech2 && definition2) {
        return {
          clue: clue.trim(),
          word1: word1.trim(),
          connector: connector.trim(),
          word2: word2.trim(),
          partOfSpeech1: partOfSpeech1.trim(),
          definition1: definition1.trim(),
          partOfSpeech2: partOfSpeech2.trim(),
          definition2: definition2.trim()
        };
      }
      return null;
    }).filter(clue => clue); // Filter out invalid rows

    // Select a random clue
    const randomClue = clues[Math.floor(Math.random() * clues.length)];
    res.json(randomClue);

  } catch (error) {
    console.error('Error fetching Google Sheet:', error.message);

    // Fallback to hardcoded clues if Google Sheets fails
    const fallbackClue = hardcodedClues[Math.floor(Math.random() * hardcodedClues.length)];
    res.json(fallbackClue);
  }
});

// Catch-all route to test server health
app.get('/', (req, res) => {
  res.send('Twyn backend is running.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
