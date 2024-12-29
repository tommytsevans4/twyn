const letterInputs = document.querySelectorAll('.letter-input');

// Auto-advance cursor as the user types
letterInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
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

// Add ENTER button functionality
document.getElementById('submit-btn').addEventListener('click', () => {
  const answer = Array.from(letterInputs)
    .map(input => input.value.toUpperCase())
    .join('');
  console.log("Your answer:", answer); // Replace this with actual game logic
});

// Fetch the clue from the back-end server
fetch('https://your-backend-url.onrender.com/clue') // Replace with your Render URL
  .then(response => response.json())
  .then(data => {
    // Update the clue in the game
    document.querySelector('#clue-box p').textContent = data.clue;

    // Log the answer (or use it for validation)
    console.log("Correct Answer:", data.answer); 
  })
  .catch(error => {
    console.error("Error fetching clue:", error);
  });

const letterInputs = document.querySelectorAll('.letter-input');
const keyboard = document.getElementById('keyboard');

// Auto-uppercase inputs
letterInputs.forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
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
}

// Submit answer function
function submitAnswer() {
  const answer = Array.from(letterInputs).map(input => input.value).join('');
  console.log("Your answer:", answer); // Replace with validation logic
}
