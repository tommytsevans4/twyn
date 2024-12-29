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
