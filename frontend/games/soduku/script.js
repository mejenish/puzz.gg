class SudokuGame {
  constructor() {
      this.board = Array(9).fill().map(() => Array(9).fill(0));
      this.solution = Array(9).fill().map(() => Array(9).fill(0));
      this.difficulty = "easy";
      this.selectedCell = null;
      this.isGameWon = false;
      
      // DOM elements
      this.gridElement = document.getElementById('grid');
      this.messageElement = document.getElementById('message');
      this.difficultySelect = document.getElementById('difficulty');
      this.newGameButton = document.getElementById('new-game');
      this.checkSolutionButton = document.getElementById('check-solution');
      this.solveButton = document.getElementById('solve');
      this.numberPad = document.querySelector('.number-pad');
      
      this.initializeBoard();
      this.setupEventListeners();
  }
  
  initializeBoard() {
      this.gridElement.innerHTML = '';
      
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              const cellInput = document.createElement('input');
              cellInput.type = 'text';
              cellInput.maxLength = 1;
              cellInput.className = 'cell-input';
              cellInput.dataset.row = row;
              cellInput.dataset.col = col;
              
              const cell = document.createElement('div');
              cell.className = 'cell';
              cell.appendChild(cellInput);
              
              this.gridElement.appendChild(cell);
          }
      }
  }
  
  setupEventListeners() {
      this.newGameButton.addEventListener('click', () => this.startNewGame());
      this.checkSolutionButton.addEventListener('click', () => this.checkSolution());
      this.solveButton.addEventListener('click', () => this.showSolution());
      this.difficultySelect.addEventListener('change', (e) => {
          this.difficulty = e.target.value;
      });
      
      this.gridElement.addEventListener('click', (e) => {
          const input = e.target.closest('.cell-input');
          if (input && !input.disabled && !this.isGameWon) {
              this.selectCell(input);
          }
      });
      
      this.gridElement.addEventListener('input', (e) => {
          const input = e.target;
          if (input.classList.contains('cell-input')) {
              const value = input.value;
              if (value && (!/^[1-9]$/.test(value))) {
                  input.value = '';
                  return;
              }
              
              const row = parseInt(input.dataset.row);
              const col = parseInt(input.dataset.col);
              this.board[row][col] = value ? parseInt(value) : 0;
              
              this.updateBoardValidation();
              this.checkForVictory();
          }
      });
      
      this.numberPad.addEventListener('click', (e) => {
          if (!this.selectedCell || this.isGameWon) return;
          
          if (e.target.classList.contains('number-btn')) {
              const buttonText = e.target.textContent;
              
              if (buttonText === 'Clear') {
                  this.selectedCell.value = '';
                  const row = parseInt(this.selectedCell.dataset.row);
                  const col = parseInt(this.selectedCell.dataset.col);
                  this.board[row][col] = 0;
              } else if (/^[1-9]$/.test(buttonText)) {
                  this.selectedCell.value = buttonText;
                  const row = parseInt(this.selectedCell.dataset.row);
                  const col = parseInt(this.selectedCell.dataset.col);
                  this.board[row][col] = parseInt(buttonText);
              }
              
              this.updateBoardValidation();
              this.checkForVictory();
          }
      });
      
      // Start with a new game
      this.startNewGame();
  }
  
  selectCell(cell) {
      // Remove selection from previous cell
      const inputs = document.querySelectorAll('.cell-input');
      inputs.forEach(input => input.classList.remove('selected'));
      
      // Select new cell
      cell.classList.add('selected');
      this.selectedCell = cell;
  }
  
  startNewGame() {
      this.isGameWon = false;
      this.messageElement.textContent = '';
      this.messageElement.classList.remove('victory');
      
      // Generate a new solved puzzle
      this.generateSolvedPuzzle();
      
      // Create puzzle by removing numbers based on difficulty
      this.createPuzzle();
      
      // Update the UI
      this.updateBoardUI();
  }
  
  generateSolvedPuzzle() {
      // Initialize empty board
      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              this.solution[i][j] = 0;
          }
      }
      
      // Fill diagonal boxes first (these can be filled independently)
      for (let box = 0; box < 9; box += 3) {
          this.fillBox(box, box);
      }
      
      // Fill the rest of the board
      this.solveSudoku(0, 0);
      
      // Copy solution to current board
      for (let i = 0; i < 9; i++) {
          this.board[i] = [...this.solution[i]];
      }
  }
  
  fillBox(row, col) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.shuffleArray(nums);
      
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              this.solution[row + i][col + j] = nums.pop();
          }
      }
  }
  
  shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }
  
  solveSudoku(row, col) {
      // If we've filled all cells, the puzzle is solved
      if (row === 9) {
          return true;
      }
      
      // If we've filled this column, move to next row
      if (col === 9) {
          return this.solveSudoku(row + 1, 0);
      }
      
      // If cell is already filled, move to next cell
      if (this.solution[row][col] !== 0) {
          return this.solveSudoku(row, col + 1);
      }
      
      // Try filling cell with numbers 1-9
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.shuffleArray(nums);
      
      for (const num of nums) {
          if (this.isValid(row, col, num)) {
              this.solution[row][col] = num;
              
              if (this.solveSudoku(row, col + 1)) {
                  return true;
              }
              
              this.solution[row][col] = 0; // Backtrack
          }
      }
      
      return false; // No valid solution for this path
  }
  
  isValid(row, col, num) {
      // Check row
      for (let i = 0; i < 9; i++) {
          if (this.solution[row][i] === num) {
              return false;
          }
      }
      
      // Check column
      for (let i = 0; i < 9; i++) {
          if (this.solution[i][col] === num) {
              return false;
          }
      }
      
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              if (this.solution[boxRow + i][boxCol + j] === num) {
                  return false;
              }
          }
      }
      
      return true;
  }
  
  createPuzzle() {
      // Determine cells to remove based on difficulty
      let cellsToRemove;
      switch (this.difficulty) {
          case 'easy':
              cellsToRemove = 40; // 41 cells empty (~45%)
              break;
          case 'medium':
              cellsToRemove = 50; // 51 cells empty (~56%)
              break;
          case 'hard':
              cellsToRemove = 60; // 61 cells empty (~67%)
              break;
          default:
              cellsToRemove = 40;
      }
      
      // Create a list of all cell positions
      const positions = [];
      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              positions.push([i, j]);
          }
      }
      
      // Shuffle the positions
      this.shuffleArray(positions);
      
      // Remove numbers from the specified number of cells
      for (let i = 0; i < cellsToRemove; i++) {
          const [row, col] = positions[i];
          this.board[row][col] = 0;
      }
  }
  
  updateBoardUI() {
      const inputs = document.querySelectorAll('.cell-input');
      
      let index = 0;
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              const value = this.board[row][col];
              const input = inputs[index++];
              
              input.value = value === 0 ? '' : value;
              input.disabled = value !== 0;
              input.classList.remove('error', 'selected');
          }
      }
      
      this.selectedCell = null;
  }
  
  updateBoardValidation() {
      const inputs = document.querySelectorAll('.cell-input');
      
      // Clear all error states first
      inputs.forEach(input => input.classList.remove('error'));
      
      // Check each cell for errors
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              const value = this.board[row][col];
              if (value === 0) continue; // Skip empty cells
              
              // Temporarily remove this value to check if it's valid
              this.board[row][col] = 0;
              const isValid = this.checkCellValidity(row, col, value);
              this.board[row][col] = value; // Put it back
              
              if (!isValid) {
                  // Find the corresponding input element
                  const input = document.querySelector(`.cell-input[data-row="${row}"][data-col="${col}"]`);
                  if (input) {
                      input.classList.add('error');
                  }
              }
          }
      }
  }
  
  checkCellValidity(row, col, value) {
      // Check row
      for (let i = 0; i < 9; i++) {
          if (i !== col && this.board[row][i] === value) {
              return false;
          }
      }
      
      // Check column
      for (let i = 0; i < 9; i++) {
          if (i !== row && this.board[i][col] === value) {
              return false;
          }
      }
      
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              const r = boxRow + i;
              const c = boxCol + j;
              if ((r !== row || c !== col) && this.board[r][c] === value) {
                  return false;
              }
          }
      }
      
      return true;
  }
  
  checkSolution() {
      // Count errors
      let errors = 0;
      let emptyCells = 0;
      
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              const value = this.board[row][col];
              
              if (value === 0) {
                  emptyCells++;
                  continue;
              }
              
              // Temporarily remove this value to check if it's valid
              this.board[row][col] = 0;
              const isValid = this.checkCellValidity(row, col, value);
              this.board[row][col] = value; // Put it back
              
              if (!isValid) {
                  errors++;
              }
          }
      }
      
      if (emptyCells > 0) {
          this.messageElement.textContent = `You still have ${emptyCells} empty cells to fill.`;
      } else if (errors > 0) {
          this.messageElement.textContent = `There are ${errors} errors in your solution.`;
      } else {
          this.messageElement.textContent = "Congratulations! Your solution is correct!";
          this.messageElement.classList.add('victory');
          this.isGameWon = true;
      }
  }
  
  checkForVictory() {
      // Check if board is full
      let isFull = true;
      let hasErrors = false;
      
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              if (this.board[row][col] === 0) {
                  isFull = false;
              } else {
                  // Check if this cell has errors
                  this.board[row][col] = 0;
                  const isValid = this.checkCellValidity(row, col, this.board[row][col]);
                  this.board[row][col] = this.board[row][col];
                  
                  if (!isValid) {
                      hasErrors = true;
                  }
              }
          }
      }
      
      if (isFull && !hasErrors) {
          this.messageElement.textContent = "Congratulations! You've solved the puzzle!";
          this.messageElement.classList.add('victory');
          this.isGameWon = true;
      }
  }
  
  showSolution() {
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              this.board[row][col] = this.solution[row][col];
          }
      }
      
      const inputs = document.querySelectorAll('.cell-input');
      
      let index = 0;
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              const input = inputs[index++];
              input.value = this.solution[row][col];
              input.classList.remove('error');
          }
      }
      
      this.messageElement.textContent = "Here's the solution.";
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const game = new SudokuGame();
});