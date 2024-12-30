const answerBox = document.getElementById('answer-box');
const keyboard = document.getElementById('keyboard');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const playBtn = document.getElementById('play-btn');
const levelButtons = document.querySelectorAll('.level-btn');
let selectedLevel = ""; // Store the selected difficulty level
let correctAnswer = ""; // Store the correct answer fetched from the backend
let currentIndex = 0; // Track the current letter position
let currentClueData = {}; // Store the current clue data with definitions

// Enable or disable the Play button based on level selection
function updatePlayButtonState() {
  if (selectedLevel) {
    playBtn.style.backgroundColor = "#2F667F";
    playBtn.style.cursor = "pointer";
    playBtn.disabled = false;
  } else {
    playBtn.style.backgroundColor = "#D5B5B4";
    playBtn.style.cursor = "not-allowed";
    playBtn.disabled = true;
  }
}

// Handle level button click
levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove the active class from all buttons
    levelButtons.forEach((btn) => btn.classList.remove("active"));
    // Add the active class to the clicked button
    button.classList.add("active");
    // Update the selected level
    selectedLevel = button.getAttribute("data-level");
    // Update the Play button state
    updatePlayButtonState();
  });
});

// Fetch the clue from the backend server based on difficulty level
function fetchClue() {
  fetch(`https://twyn.onrender.com/clue?difficulty=${selectedLevel}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Update the clue
      document.querySelector("#clue-box p").textContent = data.clue;
      correctAnswer = data.answer.toUpperCase();
      currentClueData = data; // Save clue data for definitions

      // Generate the answer boxes
      generateAnswerBoxes(correctAnswer);
    })
    .catch((error) => {
      console.error("Error fetching clue:", error);
      document.querySelector("#clue-box p").textContent =
        "Failed to load clue. Please try again later.";
    });
}

// Generate answer boxes based on the given answer
function generateAnswerBoxes(answer) {
  answerBox.innerHTML = ""; // Clear previous boxes
  answer.split("").forEach((char) => {
    if (char === " ") {
      const spacer = document.createElement("div");
      spacer.style.width = "20px"; // Add spacing for spaces in the answer
      answerBox.appendChild(spacer);
    } else {
      const box = document.createElement("span");
      box.className = "letter-box";
      box.textContent = ""; // Empty placeholder
      answerBox.appendChild(box);
    }
  });
}

// Handle keyboard input
function handleKeyboardInput(key) {
  const letterBoxes = document.querySelectorAll(".letter-box");
  if (currentIndex < letterBoxes.length) {
    letterBoxes[currentIndex].textContent = key.toUpperCase();
    currentIndex++;
  }
}

// Handle delete key input
function handleDelete() {
  const letterBoxes = document.querySelectorAll(".letter-box");
  if (currentIndex > 0) {
    currentIndex--;
    letterBoxes[currentIndex].textContent = ""; // Clear the previous box
  }
}

// Reset game function (does not reload clue)
function resetGame() {
  // Clear all boxes
  document.querySelectorAll(".letter-box").forEach(
    (box) => (box.textContent = "")
  );
  currentIndex = 0;
}

// Display result screen
function showResultScreen(isCorrect) {
  // Hide the game container
  gameContainer.classList.add("hidden");

  // Create the results screen
  const resultScreen = document.createElement("div");
  resultScreen.id = "results-screen";
  resultScreen.className = "screen";

  resultScreen.innerHTML = `
    <header class="result-header">
      <h1>${isCorrect ? "Correct!" : "Wrong!"}</h1>
    </header>
    <div class="results-content">
      <div class="answer-display">${correctAnswer}</div>
      <div class="definitions">
        <h3>Definitions</h3>
        <p><strong>${currentClueData.word1}</strong> (${currentClueData.partOfSpeech1}): ${currentClueData.definition1}</p>
        <p><strong>${currentClueData.word2}</strong> (${currentClueData.partOfSpeech2}): ${currentClueData.definition2}</p>
      </div>
      <button id="play-again-btn" class="play-btn-style">Play Again</button>
    </div>
  `;

  // Append the result screen to the body
  document.body.appendChild(resultScreen);

  // Add event listener for the "Play Again" button
  document.getElementById("play-again-btn").addEventListener("click", () => {
    resultScreen.remove(); // Remove the results screen
    initGame(); // Restart the game by showing the start screen
  });
}

// Submit answer function
function submitAnswer() {
  // Combine all the letters in the answer boxes
  const userAnswer = Array.from(document.querySelectorAll(".letter-box"))
    .map((box) => box.textContent)
    .join("")
    .trim(); // Ensure no extra spaces are included

  const isCorrect = userAnswer === correctAnswer.replace(/ /g, "");

  // Show the result screen based on whether the answer is correct
  showResultScreen(isCorrect);
}

// Create on-screen keyboard
function createKeyboard() {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  keyboard.innerHTML = ""; // Clear existing keyboard, if any

  keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    button.addEventListener("click", () => handleKeyboardInput(key));
    keyboard.appendChild(button);
  });

  // Add Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Del";
  deleteButton.classList.add("key", "special");
  deleteButton.addEventListener("click", handleDelete);
  keyboard.appendChild(deleteButton);

  // Add Reset button
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.add("key", "special");
  resetButton.addEventListener("click", resetGame);
  keyboard.appendChild(resetButton);

  // Add Enter button
  const enterButton = document.createElement("button");
  enterButton.textContent = "Enter";
  enterButton.classList.add("key", "special");
  enterButton.addEventListener("click", submitAnswer); // Attach the submitAnswer function
  keyboard.appendChild(enterButton);
}

// Handle Play button click
playBtn.addEventListener("click", () => {
  if (!selectedLevel) return; // Ensure level is selected before starting
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  fetchClue(); // Fetch clue based on the selected difficulty
  createKeyboard();
});

// Initialize the start screen
function initGame() {
  startScreen.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  selectedLevel = ""; // Reset selected level
  updatePlayButtonState(); // Reset Play button state
}

// Start the game
initGame();
