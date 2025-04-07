 // Word lists
 const easyWords = ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EARTH', 'FRUIT', 'GLASS', 'HOUSE', 'JUICE', 'KITE', 'LIGHT', 'MUSIC', 'NIGHT', 'OCEAN', 'PAINT', 'QUEEN', 'SMILE', 'TABLE', 'WATER', 'ZEBRA'];
        
 const mediumWords = ['BLEND', 'CRASH', 'DRIFT', 'FLAKE', 'GLOOM', 'HUNCH', 'JOLLY', 'KNACK', 'LATCH', 'MOUSY', 'NYMPH', 'PLUSH', 'QUILL', 'ROGUE', 'SWIRL', 'TRUCE', 'USHER', 'VOUCH', 'WHACK', 'ZESTY'];
 
 const hardWords = ['ABYSS', 'BUZZY', 'CRYPT', 'DUPLEX', 'EBONY', 'FJORD', 'GLYPH', 'HAIKU', 'IVORY', 'JAZZY', 'KHAKI', 'LYMPH', 'MYSTIFY', 'NYMPH', 'OXIDE', 'PIXEL', 'QUARTZ', 'RHYTHM', 'SPHINX', 'TOPAZ'];
 
 // Add a more comprehensive word list for valid guesses
 const validWords = [
     'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
     'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE',
     'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'ANKLE', 'APART', 'APPLE', 'APPLY',
     'ARENA', 'ARGUE', 'ARISE', 'ARMOR', 'ARMY', 'AROMA', 'ARRAY', 'ARROW', 'ASSET', 'AVOID',
     'AWARD', 'AWARE', 'AWFUL', 'BACON', 'BADGE', 'BADLY', 'BASIC', 'BASIS', 'BEACH', 'BEAM',
     'BEAN', 'BEAST', 'BEGAN', 'BEGIN', 'BEGUN', 'BEING', 'BELOW', 'BENCH', 'BERRY', 'BIRTH',
     'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLEED', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD',
     'BLOOM', 'BLUES', 'BLUFF', 'BOARD', 'BOAST', 'BONUS', 'BOOST', 'BOOTH', 'BORN', 'BORROW',
     'BOTCH', 'BOUND', 'BOWEL', 'BRAIN', 'BRAKE', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED',
     'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BRISK', 'BROKE', 'BROWN', 'BRUSH', 'BUILD', 'BUILT',
     'BULKY', 'BUNCH', 'BURST', 'CABIN', 'CABLE', 'CAMEL', 'CANAL', 'CANDY', 'CANON', 'CARGO',
     'CARRY', 'CARVE', 'CATCH', 'CAUSE', 'CEASE', 'CHAIN', 'CHAIR', 'CHALK', 'CHARM', 'CHART',
     'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHILL', 'CHINA', 'CHIPS', 'CHOKE',
     'CHORD', 'CIVIC', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK', 'CLIFF',
     'CLIMB', 'CLING', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOWN', 'COAST', 'COLOR', 'COMET',
     // ... and many more valid 5-letter words
 ].concat(easyWords, mediumWords, hardWords);

 // Game state
 let currentWord = '';
 let currentRow = 0;
 let currentTile = 0;
 let isGameOver = false;
 let difficulty = 'easy';
 let streak = 0;
 let highScore = 0;

 // DOM elements
 const board = document.getElementById('board');
 const messageEl = document.getElementById('message');
 const difficultyBtns = document.querySelectorAll('.difficulty-btn');
 const streakEl = document.getElementById('streak');
 const highScoreEl = document.getElementById('high-score');
 const modal = document.getElementById('game-over-modal');
 const modalTitle = document.getElementById('modal-title');
 const wordReveal = document.getElementById('word-reveal');
 const modalMessage = document.getElementById('modal-message');
 const playAgainBtn = document.getElementById('play-again-btn');

 // Initialize game
 function initGame() {
     // Load saved stats from localStorage
     loadStats();
     
     // Create the game board
     createBoard();
     
     // Select a word based on difficulty
     selectWord();
     
     // Add event listeners
     addEventListeners();
 }

 function createBoard() {
     board.innerHTML = '';
     for (let i = 0; i < 6; i++) {
         const row = document.createElement('div');
         row.classList.add('row');
         
         for (let j = 0; j < 5; j++) {
             const tile = document.createElement('div');
             tile.classList.add('tile');
             tile.dataset.row = i;
             tile.dataset.col = j;
             row.appendChild(tile);
         }
         
         board.appendChild(row);
     }
 }

 function selectWord() {
     let wordList;
     
     switch (difficulty) {
         case 'easy':
             wordList = easyWords;
             break;
         case 'hard':
             wordList = hardWords;
             break;
         case 'medium':
         default:
             wordList = mediumWords;
             break;
     }
     
     currentWord = wordList[Math.floor(Math.random() * wordList.length)];
     console.log(`Wordle: ${currentWord}`); // For debugging
 }

 function addEventListeners() {
     // Keyboard clicks
     document.querySelectorAll('.key').forEach(key => {
         key.addEventListener('click', () => {
             handleKeyClick(key.dataset.key);
         });
     });
     
     // Physical keyboard
     document.addEventListener('keydown', (e) => {
         if (isGameOver) return;
         
         if (e.key === 'Enter') {
             handleKeyClick('enter');
         } else if (e.key === 'Backspace') {
             handleKeyClick('backspace');
         } else if (/^[a-zA-Z]$/.test(e.key)) {
             handleKeyClick(e.key.toLowerCase());
         }
     });
     
     // Difficulty buttons
     difficultyBtns.forEach(btn => {
         btn.addEventListener('click', () => {
             if (isGameOver || btn.classList.contains('active')) return;
             
             // Ask for confirmation if changing mid-game
             if (currentRow > 0) {
                 if (!confirm('Changing difficulty will start a new game. Continue?')) {
                     return;
                 }
             }
             
             difficultyBtns.forEach(b => b.classList.remove('active'));
             btn.classList.add('active');
             
             difficulty = btn.dataset.difficulty;
             restartGame();
         });
     });
     
     // Play again button
     playAgainBtn.addEventListener('click', restartGame);
 }

 function handleKeyClick(key) {
     if (isGameOver) return;
     
     if (key === 'enter') {
         submitGuess();
     } else if (key === 'backspace') {
         deleteLetter();
     } else if (/^[a-z]$/.test(key) && currentTile < 5) {
         addLetter(key);
     }
 }

 function addLetter(letter) {
     if (currentTile < 5) {
         const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
         tile.textContent = letter.toUpperCase();
         tile.classList.add('filled');
         currentTile++;
     }
 }

 function deleteLetter() {
     if (currentTile > 0) {
         currentTile--;
         const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
         tile.textContent = '';
         tile.classList.remove('filled');
     }
 }

 function submitGuess() {
     if (currentTile !== 5) {
         showMessage("Not enough letters");
         return;
     }
     
     // Get the current guess
     let guess = '';
     for (let i = 0; i < 5; i++) {
         const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${i}"]`);
         guess += tile.textContent;
     }
     
     // Check if it's a valid word
     if (!validWords.includes(guess) && !currentWord.includes(guess)) {
         showMessage("Not in word list");
         return;
     }
     
     // Check the guess and update tile colors
     evaluateGuess(guess);
     
     // Move to next row
     currentRow++;
     currentTile = 0;
     
     // Check if game is over
     if (guess === currentWord) {
         gameWon();
     } else if (currentRow >= 6) {
         gameLost();
     }
 }

 function evaluateGuess(guess) {
     const letterCount = {};
     
     // Count letters in target word
     for (const letter of currentWord) {
         letterCount[letter] = (letterCount[letter] || 0) + 1;
     }
     
     // First pass: Mark correct letters
     const rowTiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
     const letterStates = Array(5).fill('absent');
     
     for (let i = 0; i < 5; i++) {
         const letter = guess[i];
         
         if (letter === currentWord[i]) {
             letterStates[i] = 'correct';
             letterCount[letter]--;
         }
     }
     
     // Second pass: Mark present letters
     for (let i = 0; i < 5; i++) {
         const letter = guess[i];
         
         if (letterStates[i] !== 'correct' && letterCount[letter] > 0) {
             letterStates[i] = 'present';
             letterCount[letter]--;
         }
     }
     
     // Apply states with animation delay
     for (let i = 0; i < 5; i++) {
         const tile = rowTiles[i];
         const letter = guess[i];
         const keyEl = document.querySelector(`.key[data-key="${letter.toLowerCase()}"]`);
         
         setTimeout(() => {
             // Update tile
             tile.classList.add(letterStates[i]);
             
             // Update keyboard (don't downgrade keys)
             if (letterStates[i] === 'correct') {
                 keyEl.className = 'key key-letter correct';
             } else if (letterStates[i] === 'present' && !keyEl.classList.contains('correct')) {
                 keyEl.className = 'key key-letter present';
             } else if (letterStates[i] === 'absent' && !keyEl.classList.contains('correct') && !keyEl.classList.contains('present')) {
                 keyEl.className = 'key key-letter absent';
             }
         }, i * 200);
     }
 }

 function gameWon() {
     isGameOver = true;
     
     // Increase streak and update high score
     streak++;
     if (streak > highScore) {
         highScore = streak;
     }
     
     // Save stats
     saveStats();
     updateStatsDisplay();
     
     // Show message and modal after animation completes
     setTimeout(() => {
         showModal(true);
     }, 1500);
 }

 function gameLost() {
     isGameOver = true;
     
     // Reset streak
     streak = 0;
     saveStats();
     updateStatsDisplay();
     
     // Show message and modal after animation completes
     setTimeout(() => {
         showModal(false);
     }, 1500);
 }

 function showModal(won) {
     modalTitle.textContent = won ? "You Won!" : "Game Over";
     wordReveal.textContent = `The word was: ${currentWord}`;
     
     if (won) {
         const tries = currentRow;
         modalMessage.textContent = `You found the word in ${tries} ${tries === 1 ? 'try' : 'tries'}! Current streak: ${streak}`;
         
         if (streak === highScore && highScore > 0) {
             modalMessage.textContent += " - New high score!";
         }
     } else {
         modalMessage.textContent = "Better luck next time!";
     }
     
     modal.classList.add('show');
 }

 function restartGame() {
     // Reset game state
     currentRow = 0;
     currentTile = 0;
     isGameOver = false;
     
     // Reset board
     createBoard();
     
     // Reset keyboard
     document.querySelectorAll('.key').forEach(key => {
         key.classList.remove('correct', 'present', 'absent');
     });
     
     // Select new word
     selectWord();
     
     // Hide modal
     modal.classList.remove('show');
 }

 function showMessage(text) {
     messageEl.textContent = text;
     messageEl.classList.add('show');
     
     setTimeout(() => {
         messageEl.classList.remove('show');
     }, 2000);
 }

 function saveStats() {
     const stats = {
         streak,
         highScore,
         difficulty
     };
     
     localStorage.setItem('wordleStats', JSON.stringify(stats));
 }

 function loadStats() {
     const savedStats = localStorage.getItem('wordleStats');
     
     if (savedStats) {
         const stats = JSON.parse(savedStats);
         streak = stats.streak || 0;
         highScore = stats.highScore || 0;
         difficulty = stats.difficulty || 'medium';
         
         // Update difficulty buttons
         difficultyBtns.forEach(btn => {
             btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
         });
         
         updateStatsDisplay();
     }
 }

 function updateStatsDisplay() {
     streakEl.textContent = streak;
     highScoreEl.textContent = highScore;
 }

 // Initialize the game
 initGame();