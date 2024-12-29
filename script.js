const answerBox = document.getElementById('answer-box');
const keyboard = document.getElementById('keyboard');
let correctAnswer = ""; // Store the correct answer fetched from the backend
let currentIndex = 0; // Track the current letter position

// Fetch the clue from the backend server
function fetchClue() {
  fetch('https://twyn.onrender.com/clue')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Update the clue
      document.querySelector('#clue-box p').textContent = data.clue;
      correctAnswer = data.answer.toUpperCase();

      // Generate the answer boxes
      generateAnswerBoxes(correctAnswer);
    })
    .catch(error => {
      console.error("Error fetching clue:", error);
      document.querySelector('#clue-box p').textContent = "Failed to load clue. Please try again later.";
    });
}

// Generate answer boxes based on the given answer
function generateAnswerBoxes(answer) {
  answerBox.innerHTML = ""; // Clear previous boxes
  answer.split('').forEach((char) => {
    if (char === " ") {
      const spacer = document.createElement('div');
      spacer.style.width = "20px"; // Add spacing for spaces in the answer
      answerBox.appendChild(spacer);
    } else {
      const box = document.createElement('span');
      box.className = "letter-box";
      box.textContent = ""; // Empty placeholder
      answerBox.appendChild(box);
    }
  });
}

// Handle keyboard input
function handleKeyboardInput(key) {
  const letterBoxes = document.querySelectorAll('.letter-box');
  if (currentIndex < letterBoxes.length) {
    letterBoxes[currentIndex].textContent = key.toUpperCase();
    currentIndex++;
  }
}

// Handle backspace key input
function handleBackspace() {
  const letterBoxes = document.querySelectorAll('.letter-box');
  if (currentIndex > 0) {
    currentIndex--;
    letterBoxes[currentIndex].textContent = ""; // Clear the previous box
  }
}

// Reset game function (does not reload clue)
function resetGame() {
  // Clear all boxes
  document.querySelectorAll('.letter-box').forEach(box => (box.textContent = ""));
  currentIndex = 0;
}

// Submit answer function
function submitAnswer() {
  const userAnswer = Array.from(document.querySelectorAll('.letter-box'))
    .map(box => box.textContent)
    .join('');
  if (userAnswer === correctAnswer.replace(/ /g, "")) {
    alert("Correct! 🎉");
  } else {
    alert("Incorrect. Try again!");
  }
}

// Create on-screen keyboard
function createKeyboard() {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
  keyboard.innerHTML = ""; // Clear existing keyboard, if any

  keys.forEach(key => {
    const button = document.createElement('button');
    button.textContent = key;
    button.classList.add('key');
    button.addEventListener('click', () => handleKeyboardInput(key));
    keyboard.appendChild(button);
  });

  // Add Backspace button
  const backspaceButton = document.createElement('button');
  backspaceButton.textContent = "Backspace";
  backspaceButton.classList.add('key', 'special');
  backspaceButton.addEventListener('click', handleBackspace);
  keyboard.appendChild(backspaceButton);

  // Add Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = "Reset";
  resetButton.classList.add('key', 'special');
  resetButton.addEventListener('click', resetGame);
  keyboard.appendChild(resetButton);

  // Add Enter button
  const enterButton = document.createElement('button');
  enterButton.textContent = "Enter";
  enterButton.classList.add('key', 'special');
  enterButton.addEventListener('click', submitAnswer);
  keyboard.appendChild(enterButton);
}

// Initialize the game
function initGame() {
  fetchClue(); // Fetch the clue only once
  createKeyboard(); // Create the on-screen keyboard
}

// Start the game
initGame();
