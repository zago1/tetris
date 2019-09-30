const createBoard = (rows, columns, color = VACANT) => {
  let board = [];
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      board[r][c] = color;
    }
  }

  return board;
};

const drawBoard = (board, rows, columns, context) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      drawSquare(c, r, board[c][r], context);
    }
  }
};