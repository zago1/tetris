const createBoard = () => {
  let newBoard = [];
  for (let r = 0; r < ROWS; r++) {
    newBoard[r] = [];
    for (let c = 0; c < COLUMNS; c++) {
      newBoard[r][c] = 'white';
    }
  }

  return newBoard;
};

const drawBoard = (context) => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      drawSquare(c, r, board[r][c], context);
    }
  }
};

const removeFullRowsFromBoard = () => {
  let qtdeRows = 0;
  for (let r = 0; r < ROWS; r++) {
    let rowIsFull = true;

    for (let c = 0; c < COLUMNS; c++) {
      rowIsFull = rowIsFull && (board[r][c] != VACANT);
    }

    if (rowIsFull) {
      for (let y = r; y < ROWS - 1; y++) {
        for (let c = 0; c < COLUMNS; c++) {
          board[y][c] = board[y + 1][c];
        }
      }
      for (let c = 0; c < COLUMNS; c++) {
        board[ROWS - 1][c] = VACANT;
      }

      qtdeRows += 1;
    }
  }

  return qtdeRows;
}