// Game variables
const wordChains = {
    "2024-12-11": ["SUN", "FLOWER", "POT", "LUCK", "CHARM"],
    "2024-12-12": ["BABY", "FACE", "TIME", "OUT", "HOUSE"], // Example of how to change chains daily
    // You can add more word chains here based on dates
};

let currentWordIndex = 0;
let score = 0;
let timer = 120;
let gameOver = false;
let currentWordChain = [];
let revealedLetters = 1; // Start by showing only the first letter

// DOM elements
const wordChainContainer = document.querySelector(".word-chain");
const playerInput = document.getElementById("player-input");
const submitBtn = document.getElementById("submit-btn");
const feedback = document.querySelector(".feedback");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameOverScreen = document.querySelector(".game-over");
const finalScoreDisplay = document.getElementById("final-score");
const nextWordDisplay = document.getElementById("next-word");

// Function to get the word chain for today
function getWordChainForToday() {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    if (wordChains[today]) {
        return wordChains[today];
    } else {
        // Default chain if no chain is set for today
        return ["CAT", "TIGER", "LION", "BEAR", "ELEPHANT"];
    }
}

function checkGameStatus() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");
    const gamePlayed = localStorage.getItem("gamePlayed");
  
    if (gamePlayed === "true" && lastPlayedDate === today) {
      // If the game was already played today, show a message and disable the game
      document.querySelector(".game-container").innerHTML = `
        <h2>You've already completed today's challenge!</h2>
        <p>Come back tomorrow for a new challenge.</p>
      `;
      return false; // Game should not start
    }
    return true; // Game can start
  }


// Function to start the game
function startGame() {


 if (!checkGameStatus()) return; // Exit if the game has already been played


    gameOver = false;
    score = 0;
    currentWordIndex = 0;
    timer = 120;
    revealedLetters = 1; // Start with only the first letter revealed

    // Get the word chain for today
    currentWordChain = getWordChainForToday();
    
    // Set initial values
    updateWordChain();
    updateScore();
    startTimer();
    updateNextWord();
}

// Function to update the word chain display
function updateWordChain() {
    wordChainContainer.innerHTML = "";
    for (let i = 0; i <= currentWordIndex; i++) {
        const wordElement = document.createElement("div");
        wordElement.classList.add("word");
        wordElement.textContent = currentWordChain[i];
        wordChainContainer.appendChild(wordElement);
        
    }
}

// Function to display the next word with increasing revealed letters after incorrect guesses
function updateNextWord() {

    if (currentWordIndex < currentWordChain.length - 1) {
        const nextWord = currentWordChain[currentWordIndex + 1];
        
        // Slice the word to show the first `revealedLetters` letters
        const correctLettersToShow = nextWord.slice(0, revealedLetters);
        const underscores = "_".repeat(nextWord.length - revealedLetters);
        
        // Display the correct letters and remaining underscores
        nextWordDisplay.textContent = correctLettersToShow + underscores;
    }
}
// Function to start the timer
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timer > 0 && !gameOver) {
            timer--;
            timerDisplay.textContent = timer;
        } else if (timer === 0) {
            clearInterval(timerInterval);
            //gameOverScreen.style.display = "block";
            //finalScoreDisplay.textContent = score;
            gameOver = true;
            handleGameOver();
        }
    }, 1000);
}



function submitWord() {
    const guessedWord = playerInput.value.trim().toUpperCase();


    console.log(`Guessed Word: ${guessedWord}`); // Debugging: log the guessed word
    
    
    
    // Check if the guessed word is correct
    if (guessedWord === currentWordChain[currentWordIndex + 1]) {
        score += 10;
        currentWordIndex++;
        feedback.textContent = "Correct! ✅";
        feedback.classList.remove("incorrect");
        feedback.classList.add("correct");


        // Reset revealedLetters for the next word
        revealedLetters = 1;
        console.log("word guessed correctly");


        // Check if we've reached the end of the word chain        
        if (currentWordIndex === currentWordChain.length - 1) {
            console.log("Last word guessed correctly");
            gameOver = true;
            //gameOverScreen.style.display = "block";
            //finalScoreDisplay.textContent = score;
            handleGameOver();

        } 
             
    
        else {
            updateWordChain();
            updateNextWord();
            revealedLetters = 1; // Reset the number of revealed letters after a correct guess
        }

        

    } else {
        feedback.textContent = "Incorrect! ❌";
        feedback.classList.remove("correct");
        feedback.classList.add("incorrect");
        
        
        // Increment revealedLetters by 1 on each incorrect guess, but don't exceed word length
        if (revealedLetters < currentWordChain[currentWordIndex + 1].length) {
            revealedLetters++;
        }
        
        updateNextWord(); // Update the next word with the increased revealed letters
    }
    
    playerInput.value = "";
    updateScore();
}


// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = score;
}


// Function to display the popup (win or lose)
function showPopup(type) {
    const gameContainer = document.querySelector(".game-container");
  
    // Add the blur effect to the background
    gameContainer.classList.add("blurred");

    if (type === 'win') {
      document.getElementById('winPopup').style.display = 'block';
    } else if (type === 'lose') {
      document.getElementById('losePopup').style.display = 'block';
    }
  }
  
  // Function to close the popup
  function closePopup(id) {
    const gameContainer = document.querySelector(".game-container");
    
    // Remove the blur effect
    gameContainer.classList.remove("blurred");

    document.getElementById(id).style.display = 'none';
  }
  
  // Function to handle the end of the game
  function handleGameOver() {

    const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)

      // Mark the game as completed for today in local storage
    localStorage.setItem("gamePlayed", "true");
    localStorage.setItem("lastPlayedDate", today);
    playerInput.disabled = true;
    
    if (currentWordIndex === currentWordChain.length -1 ) {
      // Player won
      showPopup('win');
    } else {
      // Player lost
      showPopup('lose');
    }
  }




// Start the game when the page loads
startGame();

// Event listener for submitting the word
submitBtn.addEventListener("click", submitWord);

// Event listener for pressing Enter
playerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        submitWord();
    }
});
