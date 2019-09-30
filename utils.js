const SQUARE = 20;
const VACANT = "white";
const COLORS = ['orange', 'red', 'indigo', 'blue', 'purple', 'green', 'cyan', 'yellow'];

const drawSquare = (x, y, fillColor, context) => {
  context.fillStyle = fillColor;
  context.fillRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
  context.strokeStyle = 'black';
  context.strokeRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
};