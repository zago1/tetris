const ROWS = 20;
const COLUMNS = 10;
const html_score = document.getElementById('score');


let score = 0;

let CURRENT_PIECE;
// let board = [];

const setScore = (value) => {
  score += value;
  html_score.innerText = 'Score: ' + score;
}

const getBonus = (qtdeRows) => {

}

const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const drawSquare = (x, y, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
};
/* BOARD */

const board = createBoard();

drawBoard(ctx);
setScore(0);
/* BOARD */

const PIECES = [[L, 'blue'], [J, 'red'], [T, 'purple'], [U, 'green'], [I, 'cyan'], [O, 'yellow']];

/* PIECE */

function Piece(tetromino, color, context, onReachEnd) {
  this.tetromino = tetromino;
  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];
  this.color = color;
  this.x = 3;
  this.y = -2;
  this.context = context;

  this.reachEnd = onReachEnd;
}

Piece.prototype.draw = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, this.color);
      }
    }
  }
}

Piece.prototype.undraw = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, VACANT);
      }
    }
  }
}

Piece.prototype.collision = function (x, y, currentPiece) {
  for (let r = 0; r < currentPiece.length; r++) {
    for (let c = 0; c < currentPiece.length; c++) {
      if (!currentPiece[r][c]) {
        continue;
      }

      let newX = this.x + c + x;
      let newY = this.y + r + y;

      if (newX < 0 || newX >= COLUMNS || newY >= ROWS) {
        return true;
      }


      if (newY < 0) { continue; }


      if (board[newY][newX] != VACANT) { return true; }
    }
  }

  return false;
}

Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.undraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    let qtdeRows = removeFullRowsFromBoard();
    if (qtdeRows > 0) {
      setScore(POINT * qtdeRows * qtdeRows);
      drawBoard();
    }
    newRandomPiece();
  }
}
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.undraw();
    this.x--;
    this.draw();
  }
}
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.undraw();
    this.x++;
    this.draw();
  }
}
Piece.prototype.rotate = function () {
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;

  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COLUMNS / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }

  if (!this.collision(0, 0, nextPattern)) {
    this.undraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}

Piece.prototype.lock = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      if (!this.activeTetromino[r][c]) { continue; }
      if (this.y + r < 0) {
        // gameover = true;
        alert('Game Over!');
        break;
      }

      board[this.y + r][this.x + c] = this.color;
    }
  }
}

function newRandomPiece() {
  const randomPieceN = Math.floor(Math.random() * PIECES.length);

  CURRENT_PIECE = new Piece(PIECES[randomPieceN][0], PIECES[randomPieceN][1], ctx, newRandomPiece);
}


/* PIECE */


newRandomPiece();

// console.log(piece);

document.addEventListener('keydown', (e) => {
  if (e.code === "ArrowLeft") {
    CURRENT_PIECE.moveLeft();
  }
  if (e.code === "ArrowRight") {
    CURRENT_PIECE.moveRight();
  }
  if (e.code === "ArrowUp") {
    CURRENT_PIECE.rotate();

  }
  if (e.code === "ArrowDown") {
    CURRENT_PIECE.moveDown();

  }
});

CURRENT_PIECE.draw();

setInterval(() => {
  CURRENT_PIECE.moveDown();
}, 900);


