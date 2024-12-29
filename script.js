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

  // Fetch a new clue and reset the game
  fetch('https://twyn.onrender.com/clue')
    .then(response => response.json())
    .then(data => {
      document.querySelector('#clue-box p').textContent = data.clue;
      correctAnswer = data.answer.toUpperCase();
      console.log("New Correct Answer:", correctAnswer);

      // Regenerate the answer boxes
      answerBox.innerHTML = "";
      correctAnswer.split('').forEach((char) => {
        if (char === " ") {
          const spacer = document.createElement('div');
          spacer.style.width = "20px";
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
