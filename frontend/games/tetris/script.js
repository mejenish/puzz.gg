const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const rows = 18; // Reduced height
const columns = 12; // Increased width
const blockSize = 30; // Size of each block

let currentScore = 0;
let highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0; // Retrieve high score from localStorage

// Define random colors for the blocks
const colors = [
    null, 'red', 'blue', 'green', 'purple', 'yellow', 'cyan', 'orange', 'pink', 'brown'
];

// The game pieces (Tetrominoes)
const tetrominoes = [
    [[1, 1, 1], [0, 1, 0]], // T shape
    [[1, 1], [1, 1]], // O shape
    [[1, 1, 0], [0, 1, 1]], // S shape
    [[0, 1, 1], [1, 1, 0]], // Z shape
    [[1, 1, 1, 1]], // I shape
    [[1, 0, 0], [1, 1, 1]], // L shape
    [[0, 0, 1], [1, 1, 1]] // J shape
];

// Game state
let board = Array.from({ length: rows }, () => Array(columns).fill(0)); // Empty board
let currentPiece, currentPos, gameInterval;
let isGameRunning = false;

// Start the game
function startGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    currentScore = 0;
    document.getElementById('currentScore').innerText = `Score: ${currentScore}`;
    generatePiece();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 500); // Update the game every 500ms
    isGameRunning = true;
    document.getElementById('startGameButton').innerText = "Reset Game";
}

// Generate a new Tetromino with random color
function generatePiece() {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    currentPiece = tetrominoes[randomIndex];
    currentPos = { x: Math.floor(columns / 2) - 1, y: 0 };
    currentPiece.color = colors[Math.floor(Math.random() * colors.length) + 1]; // Random color
}

// Draw the board and the current piece
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the board
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col]) {
                context.fillStyle = board[row][col]; // Color directly stored in the board
                context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
                context.strokeStyle = 'black';
                context.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
    // Draw the current piece
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col]) {
                const x = (currentPos.x + col) * blockSize;
                const y = (currentPos.y + row) * blockSize;
                context.fillStyle = currentPiece.color; // Color from the current piece
                context.fillRect(x, y, blockSize, blockSize);
                context.strokeStyle = 'black';
                context.strokeRect(x, y, blockSize, blockSize);
            }
        }
    }
}

// Move the piece down
function moveDown() {
    if (isMoveValid(0, 1)) {
        currentPos.y++;
    } else {
        placePiece();
        generatePiece();
        if (!isMoveValid(0, 0)) {
            clearInterval(gameInterval); // Game over
            alert('Game Over');
            isGameRunning = false;
            document.getElementById('startGameButton').innerText = "Start Game";
        }
    }
    draw();
}

// Check if a move is valid
function isMoveValid(dx, dy) {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col]) {
                const newX = currentPos.x + col + dx;
                const newY = currentPos.y + row + dy;
                if (newX < 0 || newX >= columns || newY >= rows || board[newY] && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Place the piece on the board
function placePiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col]) {
                board[currentPos.y + row][currentPos.x + col] = currentPiece.color; // Store the color directly
            }
        }
    }
    clearLines();
    currentScore += 10;
    document.getElementById('currentScore').innerText = `Score: ${currentScore}`;
    highestScore = Math.max(currentScore, highestScore);
    document.getElementById('highestScore').innerText = `High Score: ${highestScore}`;
    localStorage.setItem('highestScore', highestScore); // Save high score to localStorage
}

// Clear filled lines
function clearLines() {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(columns).fill(0));
            currentScore += 100; // Add bonus points for clearing a line
        }
    }
}

// Game loop (called every interval)
function updateGame() {
    moveDown();
}

// Listen for key events
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (isMoveValid(-1, 0)) currentPos.x--;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        if (isMoveValid(1, 0)) currentPos.x++;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        while (isMoveValid(0, 1)) currentPos.y++; // Move the piece directly to the bottom
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        rotatePiece();
    }
    draw();
});

// Rotate the current piece
function rotatePiece() {
    const rotated = currentPiece[0].map((_, index) => currentPiece.map(row => row[index])).reverse();
    const oldPiece = currentPiece;
    currentPiece = rotated;
    if (!isMoveValid(0, 0)) currentPiece = oldPiece; // Revert if invalid
    draw();
}

// Start the game when the page loads
startGame();
