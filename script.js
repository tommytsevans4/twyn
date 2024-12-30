const answerBox = document.getElementById("answer-box");
const keyboard = document.getElementById("keyboard");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const playBtn = document.getElementById("play-btn");
const levelButtons = document.querySelectorAll(".level-btn");
let selectedLevel = ""; // Store the selected difficulty level
let correctAnswer = ""; // Store the correct answer fetched from the backend
let currentIndex = 0; // Track the current letter position
let currentClueData = {}; // Store the current clue data with definitions

// Detect if the user is on a mobile device
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
    levelButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedLevel = button.getAttribute("data-level");
    updatePlayButtonState();
  });
});

// Fetch the clue from the backend server based on difficulty level
function fetchClue() {
  fetch(`https://twyn.onrender.com/clue?difficulty=${selectedLevel}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      document.querySelector("#clue-box p").textContent = data.clue;
      correctAnswer = data.answer.toUpperCase();
      currentClueData = data;
      generateAnswerBoxes(correctAnswer);
    })
    .catch((error) => {
      console.error("Error fetching clue:", error);
      document.querySelector("#clue-box p").textContent =
        "Failed to load clue. Please try again later.";
    });
}

// Generate answer boxes
function generateAnswerBoxes(answer) {
  answerBox.innerHTML = "";
  const words = answer.split(" ");
  words.forEach((word, wordIndex) => {
    const wordContainer = document.createElement("div");
    wordContainer.className = "word-container";

    word.split("").forEach((char) => {
      const box = document.createElement("span");
      box.className = "letter-box";
      box.textContent = "";
      wordContainer.appendChild(box);
    });

    answerBox.appendChild(wordContainer);
    if (wordIndex < words.length - 1) {
      const spacer = document.createElement("div");
      spacer.className = "spacer";
      spacer.style.width = "20px";
      answerBox.appendChild(spacer);
    }
  });

  if (!isMobile) {
    enableSystemKeyboardInput();
  }
}

// Enable system keyboard input for desktop
function enableSystemKeyboardInput() {
  const letterBoxes = document.querySelectorAll(".letter-box");
  letterBoxes.forEach((box, index) => {
    box.contentEditable = true;
    box.addEventListener("input", (e) => {
      box.textContent = e.target.textContent.toUpperCase().slice(0, 1);
      if (box.textContent && index < letterBoxes.length - 1) {
        letterBoxes[index + 1].focus();
      }
    });
  });
  keyboard.classList.add("hidden"); // Hide on-screen keyboard
}

// Handle on-screen keyboard input for mobile
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
    letterBoxes[currentIndex].textContent = "";
  }
}

// Reset game function
function resetGame() {
  document.querySelectorAll(".letter-box").forEach((box) => (box.textContent = ""));
  currentIndex = 0;
}

// Create on-screen keyboard for mobile
function createKeyboard() {
  if (!isMobile) {
    keyboard.classList.add("hidden"); // Hide keyboard on desktop
    return;
  }
  keyboard.classList.remove("hidden");
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  keyboard.innerHTML = "";

  keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    button.addEventListener("click", () => handleKeyboardInput(key));
    keyboard.appendChild(button);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Del";
  deleteButton.classList.add("key", "special");
  deleteButton.addEventListener("click", handleDelete);
  keyboard.appendChild(deleteButton);

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.add("key", "special");
  resetButton.addEventListener("click", resetGame);
  keyboard.appendChild(resetButton);

  const enterButton = document.createElement("button");
  enterButton.textContent = "Enter";
  enterButton.classList.add("key", "special");
  enterButton.addEventListener("click", submitAnswer);
  keyboard.appendChild(enterButton);
}

// Display result screen
function showResultScreen(isCorrect) {
  gameContainer.classList.add("hidden");
  const resultScreen = document.createElement("div");
  resultScreen.id = "results-screen";
  resultScreen.className = "screen";

  resultScreen.innerHTML = `
    <header class="app-header">
      <img src="twyn-logo.png" alt="Twyn Logo" class="header-logo" />
      <span class="header-title">Twyn</span>
    </header>
    <div class="results-content">
      <div class="result-header">
        <h1>${isCorrect ? "Correct!" : "Wrong!"}</h1>
      </div>
      <div class="answer-display">${correctAnswer}</div>
      <div class="definitions">
        <h3>Definitions</h3>
        <p><strong>${currentClueData.word1}</strong> (${currentClueData.partOfSpeech1}): ${currentClueData.definition1}</p>
        <p><strong>${currentClueData.word2}</strong> (${currentClueData.partOfSpeech2}): ${currentClueData.definition2}</p>
      </div>
      <button id="play-again-btn" class="play-btn-style">Play Again</button>
    </div>
  `;
  document.body.appendChild(resultScreen);

  document.getElementById("play-again-btn").addEventListener("click", () => {
    resultScreen.remove();
    initGame();
  });
}

// Submit answer
function submitAnswer() {
  const userAnswer = Array.from(document.querySelectorAll(".letter-box"))
    .map((box) => box.textContent)
    .join("")
    .trim();
  const isCorrect = userAnswer === correctAnswer.replace(/ /g, "");
  showResultScreen(isCorrect);
}

// Handle Play button click
playBtn.addEventListener("click", () => {
  if (!selectedLevel) return;
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  fetchClue();
  createKeyboard();
});

// Initialize game
function initGame() {
  startScreen.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  selectedLevel = "";
  updatePlayButtonState();
}

// Start the game
initGame();
