let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty game board
let gameActive = true;

// Function to handle player's move
function makeMove(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch turn
    }
}

// Function to check if there is a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            setTimeout(() => alert(`${gameBoard[a]} Wins!`), 100);
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes('')) {
        setTimeout(() => alert('It\'s a Draw!'), 100);
        gameActive = false;
    }
}

// Function to reset the game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = '';
    }
}
