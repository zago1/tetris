let ROWS = 20;
let COLUMNS = 10;

// HTML do score do jogo
const html_score = document.getElementById('score');
// HTML do tempo de jogo
const html_timer = document.getElementById('timer');
// HTML do nível de volocidade
const html_timeLeve = document.getElementById('timeLevel');
// HTML da quantidade de linhas removidas
const html_rows = document.getElementById('completeRows');

// Botão de inicialização do jogo
const btnStart = document.getElementById('btnStart');

// Div de informações do jogo
const divInfo = document.getElementById('gameInfo');

// Tabela do historico de games jogados
const gameTable = document.getElementById('gameTable');

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
// Quantidade de linhas removidas
let completeRows = 0;

let CURRENT_PIECE;
// let board = [];

divInfo.style.display = 'none';
gameTable.style.display='none';

const setScore = (value) => {
  score += value;
  html_score.innerText = 'Score: ' + score;
  html_rows.innerText = 'Linhas: ' + completeRows;

  // Caso a pontuação exceda ou seja igual ao limite do nível (500 * nivel) e o tempo não tenha 
  // atingido o mínimo (0.1s), então a velocidade do jogo é aumentada.
  // Deste modo, temos 10 níveis de jogo, decrementados em 100ms. Para aumentar a quantidade, decrementar
  // de 50ms em 50ms
  if (score >= timeLevel * 500 && time > 100) {
    timeLevel++;
    time -= 100;
    html_timeLeve.innerHTML = "Level: " + timeLevel;
  }
}

const getBonus = (qtdeRows) => {

}

let canvas = null;
let ctx = null;

let drawSquare = (x, y, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
};
/* BOARD */

let board = null;


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
      completeRows += qtdeRows;
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
        gameActive = false;

        
        $('#gameTable').DataTable().row.add( [
          document.getElementById('txtName').value,
          score, 
          timeLevel,
          getGameTime()]).draw(false);

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

setInterval(function () {

  if (gameActive) {
    html_timer.innerHTML = "Tempo de jogo: " + getGameTime();
  }
}, 1000);

function getGameTime()
{
  let difference = new Date() - initialDate;
    let stringPad = "00";

    // Time calculations for hours, minutes and seconds
    var hours = (stringPad + Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-stringPad.length);
    var minutes = (stringPad + Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).slice(-stringPad.length);
    var seconds = (stringPad + Math.floor((difference % (1000 * 60)) / 1000)).slice(-stringPad.length);

    return(hours + ":" + minutes + ":" + seconds);
}



/* PIECE */
function startGame() {
  let textName = document.getElementById('txtName');
  let selectSize = document.getElementById('selectSize');

  if (textName.value == '') {
    // Caso o usuário não informe o nome, o jogo não começa e o campo é marcado em vermelho
    textName.className = 'form-control is-invalid';
  }
  else {
    // Caso o usuáro tenha informado o nome, então o jogo é configurado inicialmente
    
    textName.className = 'form-control is-valid';
    selectSize.className = 'form-control is-valid';

    btnStart.style.display = 'none';
    divInfo.style.display = 'block';
    gameTable.style.display='block';

    $('#gameTable').DataTable( {
      language: {
        "decimal":        "",
        "emptyTable":     "Nenhum registro disponível",
        "info":           "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Exibindo 0 a 0 de 0 registros",
        "infoFiltered":   "(filtrado de _MAX_ registros)",
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Exibir _MENU_ valores",
        "loadingRecords": "Carregando...",
        "processing":     "Processando...",
        "search":         "Procurar:",
        "zeroRecords":    "Nenhum registro encontrado",
        "paginate": {
            "first":      "Primeiro",
            "last":       "Último",
            "next":       "Próximo",
            "previous":   "Anterior"
        },
        "aria": {
            "sortAscending":  ": Ative para ordenação ascendente",
            "sortDescending": ": Ative para ordenação descendente"
        }
      }
  } );

    if (selectSize.value == 1) {
      // Caso o usuário tenha informado o maior valor, então a altura e largura do canvas é reajustado
      COLUMNS = 22;
      ROWS = 44;

      document.getElementById("tetris").width = '440';
      document.getElementById("tetris").height = '880';
    }

    canvas = document.getElementById("tetris");
    ctx = canvas.getContext("2d");

    board = createBoard();
    drawBoard(ctx);

    // Define o game como ativo
    gameActive = true;
    // Guarda a data e hora do inicio do jogo
    initialDate = new Date();

    //Começa o evento de criação de peças
    newRandomPiece();
    CURRENT_PIECE.draw();
    setInterval(() => {
    CURRENT_PIECE.moveDown();

    }, time);
  }
}



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