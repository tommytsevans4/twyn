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
