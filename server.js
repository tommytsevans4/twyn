const express = require('express');
const cors = require('cors');
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

// Load clues from JSON file
const clues = JSON.parse(fs.readFileSync('./clues.json', 'utf-8'));

// Endpoint to fetch a random clue
app.get('/clue', (req, res) => {
  const randomClue = clues[Math.floor(Math.random() * clues.length)];
  res.json(randomClue);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
