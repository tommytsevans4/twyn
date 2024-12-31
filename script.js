// Declare variables at the top
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
      console.log("Clue data:", data);

      // Clear any existing content in the clue box
      const clueBox = document.getElementById("clue-box");
      clueBox.innerHTML = ""; // Clear loading text or placeholder

      // Add the clue dynamically
      const clueText = document.createElement("p");
      clueText.textContent = data.clue;
      clueBox.appendChild(clueText);

      // Set the correct answer for the game
      correctAnswer = data.answer.toUpperCase();
      generateAnswerBoxes(correctAnswer);
    })
    .catch((error) => {
      console.error("Error fetching clue:", error);

      // Display an error message in the clue box
      const clueBox = document.getElementById("clue-box");
      clueBox.innerHTML = "<p>Failed to load clue. Please try again later.</p>";
    });
}

// Generate answer boxes
function generateAnswerBoxes(answer) {
  console.log("Generating answer boxes for:", answer);
  answerBox.innerHTML = ""; // Clear previous boxes
  const words = answer.split(" ");
  words.forEach((word, wordIndex) => {
    const wordContainer = document.createElement("div");
    wordContainer.className = "word-container";

    word.split("").forEach(() => {
      const box = document.createElement("span");
      box.className = "letter-box"; // Add the class
      box.textContent = ""; // Empty placeholder
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

  console.log("Final content of #answer-box:", answerBox.innerHTML);
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
  const isCorrect = userAnswer === correctAnswer.replace(/ /g, "").toUpperCase();
  console.log("Submitted Answer:", userAnswer, "Is Correct:", isCorrect);

  // Navigate to results
  showResultScreen(isCorrect);
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
      <span class="header-title">Twyn</span>
    </header>
    <div class="results-content">
      <h1>${isCorrect ? "Correct!" : "Wrong!"}</h1>
      <div class="answer-display">${correctAnswer}</div>
      <div class="definitions">
        <h3>Definitions</h3>
        <p><strong>${currentClueData.word1}</strong> (${currentClueData.partOfSpeech1}): ${currentClueData.definition1}</p>
        <p><strong>${currentClueData.word2}</strong> (${currentClueData.partOfSpeech2}): ${currentClueData.definition2}</p>
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
  updatePlayButtonState();
}

// Start the game
initGame();
