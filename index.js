const ROWS = 20;
const COLUMNS = 10;

// HTML do score do jogo
const html_score = document.getElementById('score');
// HTML do tempo de jogo
const html_timer = document.getElementById('timer');
// HTML do nível de volocidade
const html_timeLeve = document.getElementById('timeLevel');

// Score do jogo
let score = 0;

// Variável para controle da volocidade do jogo com base no tempo (ms)
let time = 1000;
//Nível da velocidade. Utilizado para decrementar 0.1s a cada 500 pontos
let timeLevel = 1;
// Data de inicio do jogo. Utilizado para o cronometro
let initialDate = new Date();
// Status do jogo
let gameActive = false;

let CURRENT_PIECE;
// let board = [];

const setScore = (value) => {
  score += value;
  html_score.innerText = 'Score: ' + score;

  // Caso a pontuação exceda ou seja igual ao limite do nível (500 * nivel) e o tempo não tenha 
  // atingido o mínimo (0.1s), então a velocidade do jogo é aumentada.
  // Deste modo, temos 10 níveis de jogo, decrementados em 100ms. Para aumentar a quantidade, decrementar
  // de 50ms em 50ms
  if (score >= timeLevel*500 && time>100){
    timeLevel++;
    time-=100;
    html_timeLeve.innerHTML="Level: "+timeLevel;
  }
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
    console.log("teste");
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
        gameActive=false;
        alert('Game Over!');
      }

      board[this.y + r][this.x + c] = this.color;
    }
  }
}

function newRandomPiece() {

  const randomPieceN = Math.floor(Math.random() * PIECES.length);

  CURRENT_PIECE = new Piece(PIECES[randomPieceN][0], PIECES[randomPieceN][1], ctx, newRandomPiece);
}

setInterval(function() {

  if(gameActive){
  
  let difference = new Date() - initialDate;
  let stringPad = "00";

  // Time calculations for hours, minutes and seconds
  var hours = (stringPad + Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-stringPad.length);
  var minutes = (stringPad + Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).slice(-stringPad.length);
  var seconds = (stringPad + Math.floor((difference % (1000 * 60)) / 1000)).slice(-stringPad.length);

  html_timer.innerHTML = "Tempo de jogo: " + hours + ":" + minutes + ":" + seconds;
  }
}, 1000);


/* PIECE */

gameActive=true;
initialDate=new Date();
newRandomPiece();


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
}, time);


