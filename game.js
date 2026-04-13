const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const storageKey = "rooftop-ninja-best";
let bestScore = Number(localStorage.getItem(storageKey) || 0);
bestEl.textContent = bestScore;

const groundY = 420;
const gravity = 0.85;
const jumpForce = -16.5;
const baseSpeed = 7;

const state = {
  started: false,
  gameOver: false,
  score: 0,
  speed: baseSpeed,
  obstacleTimer: 0,
  time: 0,
};

const player = {
  x: 150,
  y: groundY - 74,
  width: 42,
  height: 74,
  velocityY: 0,
  onGround: true,
};

const obstacles = [];
const stars = Array.from({ length: 48 }, (_, index) => ({
  x: (index * 113) % canvas.width,
  y: 40 + ((index * 67) % 180),
  size: 1 + (index % 3),
}));

function resetGame() {
  state.started = false;
  state.gameOver = false;
  state.score = 0;
  state.speed = baseSpeed;
  state.obstacleTimer = 0;
  state.time = 0;

  player.y = groundY - player.height;
  player.velocityY = 0;
  player.onGround = true;

  obstacles.length = 0;
  updateScore();
  showOverlay("Press Space to Start", "Jump over drones, vault rooftop gaps, and keep the chase alive.");
}

function startGame() {
  if (state.started && !state.gameOver) return;

  if (state.gameOver) {
    resetGame();
  }

  state.started = true;
  overlay.classList.add("hidden");
  jump();
}

function jump() {
  if (!player.onGround) return;
  player.velocityY = jumpForce;
  player.onGround = false;
}

function showOverlay(title, text) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.remove("hidden");
}

function updateScore() {
  scoreEl.textContent = Math.floor(state.score);
  bestEl.textContent = bestScore;
}

function createObstacle() {
  const isDrone = Math.random() > 0.35;
  if (isDrone) {
    obstacles.push({
      type: "drone",
      x: canvas.width + 60,
      y: groundY - 155 - Math.random() * 55,
      width: 70,
      height: 34,
    });
  } else {
    const width = 52 + Math.random() * 34;
    obstacles.push({
      type: "barrier",
      x: canvas.width + 60,
      y: groundY - 28,
      width,
      height: 28,
    });
  }
}

function update(delta) {
  if (!state.started || state.gameOver) return;

  state.time += delta;
  state.score += delta * 0.01;
  state.speed = baseSpeed + Math.min(8, state.score / 180);
  state.obstacleTimer -= delta;

  if (state.obstacleTimer <= 0) {
    createObstacle();
    const minGap = 800;
    const maxGap = 1500;
    state.obstacleTimer = minGap + Math.random() * (maxGap - minGap) - state.speed * 35;
  }

  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.onGround = true;
  }

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = obstacles[i];
    obstacle.x -= state.speed;

    if (obstacle.x + obstacle.width < -20) {
      obstacles.splice(i, 1);
      continue;
    }

    if (isColliding(player, obstacle)) {
      endGame();
      return;
    }
  }

  updateScore();
}

function isColliding(a, b) {
  const paddingX = 8;
  const paddingY = 6;
  return (
    a.x + paddingX < b.x + b.width &&
    a.x + a.width - paddingX > b.x &&
    a.y + paddingY < b.y + b.height &&
    a.y + a.height - paddingY > b.y
  );
}

function endGame() {
  state.gameOver = true;
  state.started = false;
  const finalScore = Math.floor(state.score);
  if (finalScore > bestScore) {
    bestScore = finalScore;
    localStorage.setItem(storageKey, String(bestScore));
  }
  updateScore();
  showOverlay("Caught on the Skyline", `You scored ${finalScore}. Press Space or R to run it back.`);
}

function drawSkyline() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#12203a");
  gradient.addColorStop(0.45, "#2f3f63");
  gradient.addColorStop(1, "#0d111b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f8d27a";
  ctx.beginPath();
  ctx.arc(760, 90, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff6cf";
  for (const star of stars) {
    ctx.globalAlpha = 0.3 + Math.sin((state.time + star.x) * 0.002) * 0.2;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;

  drawParallaxBuildings("#142034", 0.18, 250, 150);
  drawParallaxBuildings("#1e2c46", 0.32, 310, 190);
  drawParallaxBuildings("#2a3957", 0.52, 380, 220);
}

function drawParallaxBuildings(color, speedFactor, baseY, maxHeight) {
  ctx.fillStyle = color;
  const width = 90;
  const spacing = 26;
  const offset = (state.time * state.speed * speedFactor * 0.05) % (width + spacing);

  for (let i = -1; i < 14; i += 1) {
    const x = i * (width + spacing) - offset;
    const height = 70 + ((i * 47) % maxHeight);
    ctx.fillRect(x, baseY - height, width, height);

    ctx.fillStyle = "rgba(255, 225, 148, 0.22)";
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if ((row + col + i) % 2 === 0) {
          ctx.fillRect(x + 16 + col * 20, baseY - height + 18 + row * 26, 8, 12);
        }
      }
    }
    ctx.fillStyle = color;
  }
}

function drawRoof() {
  ctx.fillStyle = "#202735";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  ctx.fillStyle = "#2f394d";
  for (let x = -40; x < canvas.width + 60; x += 70) {
    const shift = (state.time * state.speed * 0.12) % 70;
    ctx.fillRect(x - shift, groundY + 12, 44, 12);
  }

  ctx.fillStyle = "#4c596d";
  ctx.fillRect(0, groundY, canvas.width, 10);
}

function drawPlayer() {
  const runBounce = player.onGround && state.started ? Math.sin(state.time * 0.025) * 4 : 0;
  const x = player.x;
  const y = player.y + runBounce;

  ctx.fillStyle = "#101722";
  ctx.fillRect(x + 8, y + 18, 26, 40);

  ctx.fillStyle = "#ff6b35";
  ctx.fillRect(x + 10, y + 18, 22, 14);

  ctx.fillStyle = "#efe6d2";
  ctx.fillRect(x + 13, y + 6, 16, 16);

  ctx.fillStyle = "#09111f";
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 18);
  ctx.lineTo(x + 34, y + 18);
  ctx.lineTo(x + 21, y - 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#ffb46c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 18, y + 58);
  ctx.lineTo(x + 13, y + 74);
  ctx.moveTo(x + 24, y + 58);
  ctx.lineTo(x + 30, y + 74);
  ctx.moveTo(x + 10, y + 30);
  ctx.lineTo(x - 2, y + 42);
  ctx.moveTo(x + 32, y + 32);
  ctx.lineTo(x + 44, y + 20);
  ctx.stroke();

  ctx.strokeStyle = "#90f0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 42, y + 24);
  ctx.lineTo(x + 62, y + 14);
  ctx.stroke();
}

function drawObstacles() {
  for (const obstacle of obstacles) {
    if (obstacle.type === "drone") {
      ctx.fillStyle = "#6ce5ff";
      ctx.fillRect(obstacle.x + 8, obstacle.y + 8, obstacle.width - 16, obstacle.height - 12);

      ctx.strokeStyle = "#d8fbff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(obstacle.x + 4, obstacle.y + 8);
      ctx.lineTo(obstacle.x + obstacle.width - 4, obstacle.y + 8);
      ctx.moveTo(obstacle.x + 14, obstacle.y);
      ctx.lineTo(obstacle.x + 2, obstacle.y + 16);
      ctx.moveTo(obstacle.x + obstacle.width - 14, obstacle.y);
      ctx.lineTo(obstacle.x + obstacle.width - 2, obstacle.y + 16);
      ctx.stroke();

      ctx.fillStyle = "#ff6b35";
      ctx.fillRect(obstacle.x + obstacle.width - 18, obstacle.y + 14, 8, 8);
    } else {
      ctx.fillStyle = "#ffb703";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.fillStyle = "#1d1d1d";
      for (let stripe = 0; stripe < obstacle.width; stripe += 16) {
        ctx.fillRect(obstacle.x + stripe, obstacle.y + obstacle.height - 10, 8, 10);
      }
    }
  }
}

function drawDistanceMeter() {
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(28, 28, 180, 12);
  ctx.fillStyle = "#ff6b35";
  ctx.fillRect(28, 28, Math.min(180, (state.speed / 15) * 180), 12);

  ctx.fillStyle = "#f6f3ea";
  ctx.font = '18px "Outfit"';
  ctx.fillText(`Velocity ${state.speed.toFixed(1)}`, 28, 62);
}

function render() {
  drawSkyline();
  drawRoof();
  drawObstacles();
  drawPlayer();
  drawDistanceMeter();
}

let lastTime = 0;
function gameLoop(timestamp) {
  const delta = Math.min(32, timestamp - lastTime || 16);
  lastTime = timestamp;
  update(delta);
  render();
  requestAnimationFrame(gameLoop);
}

function handleActionKey(event) {
  const jumpKeys = ["Space", "ArrowUp", "KeyW"];
  if (!jumpKeys.includes(event.code) && event.code !== "KeyR") return;

  event.preventDefault();

  if (event.code === "KeyR") {
    resetGame();
    return;
  }

  if (!state.started || state.gameOver) {
    startGame();
    return;
  }

  jump();
}

window.addEventListener("keydown", handleActionKey);

resetGame();
render();
requestAnimationFrame(gameLoop);
