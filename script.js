const letterInputs = document.querySelectorAll('.letter-input');
const keyboard = document.getElementById('keyboard');
let correctAnswer = ""; // Store the correct answer fetched from the backend

// Auto-advance cursor as the user types
letterInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase(); // Ensure uppercase
    if (input.value.length === 1 && index < letterInputs.length - 1) {
      letterInputs[index + 1].focus();
    }
  });

  // Move to previous input on backspace
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value === '' && index > 0) {
      letterInputs[index - 1].focus();
    }
  });
});

// Fetch the clue from the backend server
fetch('https://twyn.onrender.com/clue')
  .then(response => response.json())
  .then(data => {
    // Update the clue and store the correct answer
    document.querySelector('#clue-box p').textContent = data.clue;
    correctAnswer = data.answer.toUpperCase();
    console.log("Correct Answer:", correctAnswer); // Debugging
  })
  .catch(error => {
    console.error("Error fetching clue:", error);
    document.querySelector('#clue-box p').textContent = "Failed to load clue. Try again.";
  });

// Create on-screen keyboard
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
keys.forEach(key => {
  const button = document.createElement('button');
  button.textContent = key;
  button.classList.add('key');
  button.addEventListener('click', () => handleKeyboardInput(key));
  keyboard.appendChild(button);
});

// Add Reset and Enter buttons
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset';
resetButton.classList.add('key', 'special');
resetButton.addEventListener('click', resetGame);
keyboard.appendChild(resetButton);

const enterButton = document.createElement('button');
enterButton.textContent = 'Enter';
enterButton.classList.add('key', 'special');
enterButton.addEventListener('click', submitAnswer);
keyboard.appendChild(enterButton);

// Handle keyboard input
function handleKeyboardInput(key) {
  const emptyInput = Array.from(letterInputs).find(input => input.value === '');
  if (emptyInput) {
    emptyInput.value = key.toUpperCase();
    emptyInput.focus();
  }
}

// Reset game function
function resetGame() {
  letterInputs.forEach(input => {
    input.value = '';
  });
  fetch('https://twyn.onrender.com/clue')
    .then(response => response.json())
    .then(data => {
      document.querySelector('#clue-box p').textContent = data.clue;
      correctAnswer = data.answer.toUpperCase();
      console.log("New Correct Answer:", correctAnswer); // Debugging
    })
    .catch(error => {
      console.error("Error fetching clue:", error);
      document.querySelector('#clue-box p').textContent = "Failed to load clue. Try again.";
    });
}

// Submit answer function
function submitAnswer() {
  const userAnswer = Array.from(letterInputs).map(input => input.value).join('');
  if (userAnswer === correctAnswer) {
    alert("Correct! 🎉");
  } else {
    alert("Incorrect. Try again!");
  }
}

const letterBoxes = document.querySelectorAll('.letter-box');
let currentIndex = 0;

// Function to handle keyboard input
function handleKeyboardInput(key) {
  if (currentIndex < letterBoxes.length) {
    letterBoxes[currentIndex].textContent = key.toUpperCase();
    currentIndex++;
  }
}

// Add Reset functionality
function resetGame() {
  letterBoxes.forEach(box => (box.textContent = ""));
  currentIndex = 0;
}

// Add Submit functionality
function submitAnswer() {
  const userAnswer = Array.from(letterBoxes)
    .map(box => box.textContent)
    .join("");
  console.log("Your answer:", userAnswer);
  // Compare userAnswer to the correct answer here
}

// Create an on-screen keyboard
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
const keyboard = document.getElementById('keyboard');

keys.forEach(key => {
  const button = document.createElement('button');
  button.textContent = key;
  button.classList.add('key');
  button.addEventListener('click', () => handleKeyboardInput(key));
  keyboard.appendChild(button);
});

// Add Reset and Enter buttons to the keyboard
const resetButton = document.createElement('button');
resetButton.textContent = "Reset";
resetButton.classList.add('key', 'special');
resetButton.addEventListener('click', resetGame);
keyboard.appendChild(resetButton);

const enterButton = document.createElement('button');
enterButton.textContent = "Enter";
enterButton.classList.add('key', 'special');
enterButton.addEventListener('click', submitAnswer);
keyboard.appendChild(enterButton);

const answerBox = document.getElementById('answer-box');
const keyboard = document.getElementById('keyboard');
let correctAnswer = ""; // Store the correct answer fetched from the backend
let currentIndex = 0; // Track the current letter position

// Fetch the clue from the backend server
fetch('https://twyn.onrender.com/clue')
  .then(response => response.json())
  .then(data => {
    // Update the clue
    document.querySelector('#clue-box p').textContent = data.clue;
    correctAnswer = data.answer.toUpperCase();

    // Dynamically generate the answer boxes
    answerBox.innerHTML = ""; // Clear previous boxes
    correctAnswer.split('').forEach((char) => {
      if (char === " ") {
        const spacer = document.createElement('div');
        spacer.style.width = "20px"; // Add spacing for spaces in the answer
        answerBox.appendChild(spacer);
      } else {
        const box = document.createElement('span');
        box.className = char === "T" || char === "H" || char === "E" ? "fixed-box" : "letter-box";
        box.textContent = char === "T" || char === "H" || char === "E" ? char : "";
        answerBox.appendChild(box);
      }
    });
  })
  .catch(error => {
    console.error("Error fetching clue:", error);
    document.querySelector('#clue-box p').textContent = "Failed to load clue. Try again.";
  });

// Handle keyboard input
function handleKeyboardInput(key) {
  const letterBoxes = document.querySelectorAll('.letter-box');
  if (currentIndex < letterBoxes.length) {
    letterBoxes[currentIndex].textContent = key.toUpperCase();
    currentIndex++;
  }
}

// Reset game function
function resetGame() {
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
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
keys.forEach(key => {
  const button = document.createElement('button');
  button.textContent = key;
  button.classList.add('key');
  button.addEventListener('click', () => handleKeyboardInput(key));
  keyboard.appendChild(button);
});

// Add Reset and Enter buttons to the keyboard
const resetButton = document.createElement('button');
resetButton.textContent = "Reset";
resetButton.classList.add('key', 'special');
resetButton.addEventListener('click', resetGame);
keyboard.appendChild(resetButton);

const enterButton = document.createElement('button');
enterButton.textContent = "Enter";
enterButton.classList.add('key', 'special');
enterButton.addEventListener('click', submitAnswer);
keyboard.appendChild(enterButton);
