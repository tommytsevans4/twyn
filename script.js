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
