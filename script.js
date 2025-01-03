// Declare variables at the top
const answerBox = document.getElementById("answer-box");
const keyboard = document.getElementById("keyboard");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const playBtn = document.getElementById("play-btn");
const levelButtons = document.querySelectorAll(".level-btn");
const attemptSymbols = document.getElementById("attempt-symbols"); // Element for attempt symbols
let selectedLevel = ""; // Store the selected difficulty level
let correctAnswer = ""; // Store the correct answer fetched from the backend
let currentIndex = 0; // Track the current letter position
let currentClueData = {}; // Store the current clue data with definitions
let attempts = 0; // Track the number of attempts
const maxAttempts = 4; // Maximum number of attempts

// Enable or disable the Play button based on level selection
function updatePlayButtonState() {
  if (selectedLevel) {
    playBtn.style.backgroundColor = "#2F667F";
    playBtn.style.cursor = "pointer";
    playBtn.disabled = false;
  } else {
    playBtn.style.backgroundColor = "#a2bac4";
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
  console.log("Fetching clue...");
  fetch(`https://twyn.onrender.com/clue?difficulty=${selectedLevel}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Clue fetched successfully");
      return response.json();
    })
    .then((data) => {
      console.log("Backend response data:", data);

      const clueBox = document.getElementById("clue-box");
      clueBox.innerHTML = ""; // Clear loading text or placeholder

      const clueText = document.createElement("p");
      clueText.textContent = data.clue || "Clue not available";
      clueBox.appendChild(clueText);

      // Build the full answer
      const fullAnswer = `${data.word1} ${data.connector} ${data.word2}`.toUpperCase();
      correctAnswer = `${data.word1} ${data.word2}`.toUpperCase(); // Player only guesses words
      console.log("Full Answer:", fullAnswer);
      console.log("Correct Answer (for input):", correctAnswer);

      // Safeguard for undefined fields
      currentClueData = {
        word1: data.word1 || "N/A",
        partOfSpeech1: data.partOfSpeech1 || "N/A",
        definition1: data.definition1 || "Definition not available",
        word2: data.word2 || "N/A",
        partOfSpeech2: data.partOfSpeech2 || "N/A",
        definition2: data.definition2 || "Definition not available",
        connector: data.connector || "N/A", // Include the connector
      };

      console.log("Current Clue Data:", currentClueData);

      // Generate answer boxes
      generateAnswerBoxes(data.word1, data.connector, data.word2);
      initializeAttempts(); // Initialize attempts
    })
    .catch((error) => {
      console.error("Error fetching clue:", error);

      // Display an error message in the clue box
      const clueBox = document.getElementById("clue-box");
      clueBox.innerHTML = "<p>Failed to load clue. Please try again later.</p>";
    });
}

// Initialize attempt symbols
function initializeAttempts() {
  if (!attemptSymbols) {
    console.error("Attempt symbols container not found!");
    return;
  }

  attemptSymbols.innerHTML = ""; // Clear existing symbols
  for (let i = 0; i < maxAttempts; i++) {
    const symbolPair = document.createElement("span");
    symbolPair.className = "attempt-symbol";
    symbolPair.textContent = "유유"; // Korean symbols
    symbolPair.style.opacity = 1; // Default opacity
    attemptSymbols.appendChild(symbolPair);
  }
}

// Generate answer boxes
function generateAnswerBoxes(word1, connector, word2) {
  console.log("Generating answer boxes for:", word1, connector, word2);

  answerBox.innerHTML = ""; // Clear previous boxes

  // Word1
  const word1Container = document.createElement("div");
  word1Container.className = "word-container";
  word1.split("").forEach(() => {
    const box = document.createElement("span");
    box.className = "letter-box";
    box.textContent = ""; // Empty placeholder
    word1Container.appendChild(box);
  });
  answerBox.appendChild(word1Container);

  // Connector
  const connectorText = document.createElement("div");
  connectorText.className = "connector-text";
  connectorText.textContent = connector.toUpperCase();
  answerBox.appendChild(connectorText);

  // Word2
  const word2Container = document.createElement("div");
  word2Container.className = "word-container";
  word2.split("").forEach(() => {
    const box = document.createElement("span");
    box.className = "letter-box";
    box.textContent = ""; // Empty placeholder
    word2Container.appendChild(box);
  });
  answerBox.appendChild(word2Container);

  console.log("Answer boxes generated");
}

// Handle keyboard input
function createKeyboard() {
  console.log("Creating keyboard...");
  keyboard.innerHTML = ""; // Clear the keyboard

  const row1Keys = "QWERTYUIOP".split("");
  const row2Keys = "ASDFGHJKL".split("");
  const row3Keys = ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"];

  const row1 = document.createElement("div");
  row1.classList.add("keyboard-row");
  row1Keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    button.addEventListener("click", () => handleKeyboardInput(key));
    row1.appendChild(button);
  });

  const row2 = document.createElement("div");
  row2.classList.add("keyboard-row");
  row2Keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    button.addEventListener("click", () => handleKeyboardInput(key));
    row2.appendChild(button);
  });

  const row3 = document.createElement("div");
  row3.classList.add("keyboard-row");
  row3Keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");

    // Add specific classes for special keys
    if (key === "Enter") {
      button.classList.add("special", "enter-key");
    } else if (key === "⌫") {
      button.classList.add("special", "delete-key");
    }

    button.addEventListener("click", () => {
      if (key === "Enter") {
        submitAnswer();
      } else if (key === "⌫") {
        handleDelete();
      } else {
        handleKeyboardInput(key);
      }
    });
    row3.appendChild(button);
  });

  keyboard.appendChild(row1);
  keyboard.appendChild(row2);
  keyboard.appendChild(row3);

  console.log("Keyboard HTML:", keyboard.innerHTML);
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
    letterBoxes[currentIndex].textContent = "";
  }
}

// Submit answer
function submitAnswer() {
  const userAnswer = Array.from(document.querySelectorAll(".letter-box"))
    .map((box) => box.textContent)
    .join("")
    .trim();
  const isCorrect =
    userAnswer ===
    `${currentClueData.word1}${currentClueData.word2}`.replace(/ /g, "").toUpperCase();

  console.log("Submitted Answer:", userAnswer, "Is Correct:", isCorrect);

  if (isCorrect) {
    // Correct answer: Proceed to the results screen
    showResultScreen(true);
    return;
  }

  // Incorrect answer: Handle attempts
  attempts++;
  if (attempts < maxAttempts) {
    // Update the attempt symbol opacity for the current attempt
    attemptSymbols.children[attempts - 1].style.opacity = "0.5";

    // Clear letter boxes for the next attempt
    clearLetterBoxes();
    return;
  }

  // Max attempts reached: Proceed to the results screen
  showResultScreen(false);
}

// Clear all letter boxes and reset the cursor
function clearLetterBoxes() {
  const letterBoxes = document.querySelectorAll(".letter-box");
  letterBoxes.forEach((box) => (box.textContent = ""));
  currentIndex = 0; // Reset cursor to the first box
}

// Display the results screen
function showResultScreen(isCorrect) {
  // Hide the game container
  gameContainer.classList.add("hidden");

  // Create the result screen container
  const resultScreen = document.createElement("div");
  resultScreen.className = "screen";

  // Generate the definitions content dynamically
  const definitionContent = `
    <h3>Definitions</h3>
    <p><strong>${currentClueData.word1}</strong> (${currentClueData.partOfSpeech1}): ${currentClueData.definition1}</p>
    <p><strong>${currentClueData.word2}</strong> (${currentClueData.partOfSpeech2}): ${currentClueData.definition2}</p>
  `;

  // Add the app header and results content
  resultScreen.innerHTML = `
    <header class="app-header">
      <img src="/twyn-logo-white.png" alt="Twyn Logo" class="header-logo" />
    </header>
    <div class="results-content">
      <h1>${isCorrect ? "Correct!" : "Wrong!"}</h1>
      <div class="answer-display">${currentClueData.word1.toUpperCase()} ${currentClueData.connector.toUpperCase()} ${currentClueData.word2.toUpperCase()}</div>
      <div class="definitions">
        ${definitionContent}
      </div>
      <button id="play-again-btn">Play Again</button>
    </div>
  `;

  // Append the results screen to the body
  document.body.appendChild(resultScreen);

  // Add functionality to the "Play Again" button
  document.getElementById("play-again-btn").addEventListener("click", () => {
    resultScreen.remove();
    initGame();
  });
}

// Handle Play button click
playBtn.addEventListener("click", () => {
  console.log("Play button clicked");
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
  attempts = 0; // Reset attempts
  updatePlayButtonState();
}

// Start the game
document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
