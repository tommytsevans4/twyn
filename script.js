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
      document.querySelector("#clue-box p").textContent = data.clue;
      correctAnswer = data.answer.toUpperCase();
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
  console.log("Generating answer boxes for:", answer);
  answerBox.innerHTML = ""; // Clear previous boxes
  const words = answer.split(" ");
  words.forEach((word, wordIndex) => {
    const wordContainer = document.createElement("div");
    wordContainer.className = "word-container";

    word.split("").forEach((char) => {
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitAnswer();
    }
  });

  keyboard.classList.add("hidden");
}

function createKeyboard() {
  if (!isMobile) {
    keyboard.classList.add("hidden"); // Hide keyboard on desktop
    return;
  }
  keyboard.classList.remove("hidden");
  keyboard.innerHTML = ""; // Clear the keyboard

  const row1Keys = "QWERTYUIOP".split("");
  const row2Keys = "ASDFGHJKL".split("");
  const row3Keys = ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Del"];

  // Create the rows
  const row1 = document.createElement("div");
  row1.classList.add("row-1");
  row1Keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    button.addEventListener("click", () => handleKeyboardInput(key));
    row1.appendChild(button);
  });

  const row2 = document.createElement("div");
  row2.classList.add("row-2");
  row2Keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    button.addEventListener("click", () => handleKeyboardInput(key));
    row2.appendChild(button);
  });

  const row3 = document.createElement("div");
  row3.classList.add("row-3");
  row3Keys.forEach((key) => {
    const button = document.createElement("button");
    button.textContent = key;
    button.classList.add("key");
    if (key === "Enter" || key === "Del") {
      button.classList.add("special");
    }
    button.addEventListener("click", () => {
      if (key === "Enter") {
        submitAnswer();
      } else if (key === "Del") {
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
}

// Handle Play button click
playBtn.addEventListener("click", () => {
  console.log("Play button clicked");
  if (!selectedLevel) return; // Ensure a level is selected before proceeding
  startScreen.classList.add("hidden"); // Hide the start screen
  console.log("Start screen hidden");
  gameContainer.classList.remove("hidden"); // Show the game screen
  console.log("Game container shown");
  fetchClue(); // Fetch the first clue
  console.log("Creating keyboard..."); // Log for keyboard creation
  createKeyboard(); // Set up the keyboard
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
