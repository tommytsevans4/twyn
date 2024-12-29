const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Hardcoded clues for fallback or testing
const hardcodedClues = [
  { clue: "Illegally acquire metal", answer: "STEAL THE STEEL" },
  { clue: "Bark of a tree or sound of a dog", answer: "BARK THE BARK" }
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
      const [clue, answer] = row.split(',');
      return { clue, answer };
    });

    // Select a random clue
    const randomClue = clues[Math.floor(Math.random() * clues.length)];
    res.json(randomClue);

  } catch (error) {
    console.error('Error fetching Google Sheet:', error);

    // Fallback to hardcoded clues if Google Sheets fails
    const fallbackClue = hardcodedClues[Math.floor(Math.random() * hardcodedClues.length)];
    res.json(fallbackClue);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
