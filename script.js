const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

canvas.width = 480;
canvas.height = 320;

let gameOver = false;

// Paddle
const paddle = {
  width: 75,
  height: 10,
  x: (canvas.width - 75) / 2,
  speed: 5,
  dx: 0
};

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 7,
  speed: 3,
  dx: 3,
  dy: -3
};

// Bricks
const brickRowCount = 5;
const brickColumnCount = 7;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 3;
const brickOffRight = 3;

const brickWidth = (
  canvas.width - brickOffsetLeft - brickOffRight - brickPadding * (brickColumnCount - 1)
) / brickColumnCount;
const brickHeight = 20;


let bricks = [];

function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = "#ff6347";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

// Move paddle
function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  // Paddle collision
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.y + ball.radius > canvas.height - paddle.height
  ) {
    ball.dy *= -1;
  }

  // Brick collision
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy *= -1;
          b.status = 0;
        }
      }
    }
  }

  // Win condition
  if (bricks.flat().every(b => b.status === 0)) {
    gameOver = true;
    showMessage("🎉 You Win!");
  }

  // Lose condition
  if (ball.y + ball.radius > canvas.height) {
    gameOver = true;
    showMessage("💥 Game Over");
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
}

// Game loop
function update() {
  if (!gameOver) {
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
  }
}

// Show win/lose message
function showMessage(text) {
  message.textContent = text;
  message.style.display = "block";
  restartBtn.style.display = "block";
}

// Keyboard events
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
  else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
}

function keyUp(e) {
  if (["Right", "ArrowRight", "Left", "ArrowLeft"].includes(e.key)) paddle.dx = 0;
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Restart
restartBtn.addEventListener("click", () => {
  document.location.reload();
});

// Init
initBricks();
update();
