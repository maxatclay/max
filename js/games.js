/* ============================================
   MINI GAMES ENGINE
   "Work? No. Snake? Yes."
   ============================================ */

// =============================
// GAME 1: SNAKE
// =============================
function initSnakeGame(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const gridSize = 15;
  const tileCount = Math.floor(canvas.width / gridSize);
  const tileCountY = Math.floor(canvas.height / gridSize);

  let snake = [{ x: 10, y: 10 }];
  let food = { x: 5, y: 5 };
  let dx = 0, dy = 0;
  let score = 0;
  let gameRunning = false;
  let gameLoop = null;
  let speed = 120;

  const scoreEl = document.getElementById(canvasId + '-score');
  const startBtn = document.getElementById(canvasId + '-start');

  // Neon colors for the snake
  const snakeColors = ['#39ff14', '#32e612', '#2bcc10', '#24b30e', '#1d990c'];

  function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCountY);
    // Don't place on snake
    for (const seg of snake) {
      if (seg.x === food.x && seg.y === food.y) {
        placeFood();
        return;
      }
    }
  }

  function drawGame() {
    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < tileCountY; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }

    // Food (pulsing)
    const pulse = Math.sin(Date.now() / 200) * 2;
    ctx.font = (gridSize + pulse) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const foodEmojis = ['🍕', '🌮', '🍔', '🍩', '🍪', '🧁', '🍣'];
    ctx.fillText(
      foodEmojis[score % foodEmojis.length],
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2
    );

    // Snake
    snake.forEach((seg, i) => {
      const colorIdx = Math.min(i, snakeColors.length - 1);
      ctx.fillStyle = snakeColors[colorIdx];
      ctx.shadowColor = snakeColors[0];
      ctx.shadowBlur = i === 0 ? 10 : 3;
      ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);

      // Eyes on head
      if (i === 0) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.fillRect(seg.x * gridSize + 3, seg.y * gridSize + 3, 4, 4);
        ctx.fillRect(seg.x * gridSize + gridSize - 7, seg.y * gridSize + 3, 4, 4);
      }
    });
    ctx.shadowBlur = 0;

    // Start message
    if (!gameRunning) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillStyle = '#39ff14';
      ctx.textAlign = 'center';
      ctx.fillText(score > 0 ? 'GAME OVER!' : 'PRESS START', canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillStyle = '#888';
      ctx.fillText('Use Arrow Keys', canvas.width / 2, canvas.height / 2 + 15);
    }
  }

  function update() {
    if (!gameRunning) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCountY) {
      gameOver();
      return;
    }

    // Self collision
    for (const seg of snake) {
      if (seg.x === head.x && seg.y === head.y) {
        gameOver();
        return;
      }
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score++;
      if (scoreEl) scoreEl.textContent = 'Score: ' + score;
      placeFood();
      if (speed > 60) speed -= 3;
    } else {
      snake.pop();
    }

    drawGame();
  }

  function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    if (startBtn) startBtn.textContent = '🐍 Play Again';
    drawGame();

    // Silly game over messages
    const messages = [
      'The snake has perished. F in chat.',
      'RIP Snakey McSnakeface 🐍💀',
      'Your LinkedIn headline: "Failed Snake Player"',
      'Even the snake couldn\'t handle your moves.',
      'Game Over! Time to update your resume.',
    ];
    if (scoreEl) scoreEl.textContent = messages[Math.floor(Math.random() * messages.length)] + ' (Score: ' + score + ')';
  }

  function startGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    speed = 120;
    gameRunning = true;
    placeFood();
    if (scoreEl) scoreEl.textContent = 'Score: 0';
    if (startBtn) startBtn.textContent = '🐍 Playing...';

    clearInterval(gameLoop);
    gameLoop = setInterval(update, speed);

    // Restart interval with new speed after eating
    const checkSpeed = setInterval(() => {
      if (!gameRunning) {
        clearInterval(checkSpeed);
        return;
      }
      clearInterval(gameLoop);
      gameLoop = setInterval(update, speed);
    }, 1000);
  }

  // Controls
  document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.key) {
      case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } e.preventDefault(); break;
      case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } e.preventDefault(); break;
      case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } e.preventDefault(); break;
      case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } e.preventDefault(); break;
    }
  });

  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  drawGame();
}


// =============================
// GAME 2: WHACK-A-MOLE (but it's Whack-a-Bug)
// =============================
function initWhackGame(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let whackScore = 0;
  let whackTimeLeft = 30;
  let whackRunning = false;
  let whackTimer = null;
  let moleTimer = null;

  const scoreEl = document.getElementById(containerId + '-score');
  const timerEl = document.getElementById(containerId + '-timer');
  const startBtn = document.getElementById(containerId + '-start');
  const grid = document.getElementById(containerId + '-grid');

  const bugs = ['🐛', '🐞', '🪲', '🦗', '🕷️', '🐜'];
  const bonusItems = ['💎', '⭐', '🏆'];

  // Create holes
  const holes = [];
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.style.cssText = `
      width: 70px; height: 70px;
      background: radial-gradient(ellipse, #1a0a00, #330a00);
      border: 3px ridge #8B4513;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px;
      cursor: crosshair;
      user-select: none;
      transition: background 0.1s;
      position: relative;
    `;
    hole.dataset.index = i;
    hole.dataset.active = 'false';
    hole.innerHTML = '';

    hole.addEventListener('click', () => {
      if (!whackRunning || hole.dataset.active !== 'true') {
        // Miss animation
        hole.style.background = 'radial-gradient(ellipse, #330000, #1a0000)';
        setTimeout(() => {
          hole.style.background = 'radial-gradient(ellipse, #1a0a00, #330a00)';
        }, 150);
        return;
      }

      const isBonus = hole.dataset.bonus === 'true';
      const points = isBonus ? 5 : 1;
      whackScore += points;
      if (scoreEl) scoreEl.textContent = 'Score: ' + whackScore;

      // Hit effect
      hole.innerHTML = isBonus ? '💥' : '💨';
      hole.dataset.active = 'false';
      hole.style.background = 'radial-gradient(ellipse, #003300, #001a00)';

      // Floating score popup
      const floater = document.createElement('div');
      floater.textContent = '+' + points;
      floater.style.cssText = `
        position: absolute; top: -20px; left: 50%; transform: translateX(-50%);
        color: ${isBonus ? '#FFD700' : '#39ff14'}; font-family: 'Press Start 2P', monospace;
        font-size: 14px; pointer-events: none; z-index: 10;
        animation: float-score 0.8s ease-out forwards;
      `;
      hole.appendChild(floater);
      setTimeout(() => floater.remove(), 800);

      setTimeout(() => {
        hole.innerHTML = '';
        hole.style.background = 'radial-gradient(ellipse, #1a0a00, #330a00)';
      }, 200);
    });

    holes.push(hole);
    grid.appendChild(hole);
  }

  // Add the float animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-score {
      0% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
    }
  `;
  document.head.appendChild(style);

  function spawnMole() {
    if (!whackRunning) return;

    // Clear all active moles
    holes.forEach(h => {
      if (h.dataset.active === 'true') {
        h.innerHTML = '';
        h.dataset.active = 'false';
      }
    });

    // Spawn 1-2 moles
    const count = Math.random() > 0.7 ? 2 : 1;
    const indices = [];
    for (let i = 0; i < count; i++) {
      let idx;
      do {
        idx = Math.floor(Math.random() * 9);
      } while (indices.includes(idx));
      indices.push(idx);

      const hole = holes[idx];
      const isBonus = Math.random() > 0.85;
      hole.dataset.active = 'true';
      hole.dataset.bonus = isBonus ? 'true' : 'false';
      hole.innerHTML = isBonus
        ? bonusItems[Math.floor(Math.random() * bonusItems.length)]
        : bugs[Math.floor(Math.random() * bugs.length)];
      hole.style.transform = 'scale(1)';
      hole.style.animation = 'wobble 0.3s ease infinite';

      // Auto-hide after timeout
      const hideDelay = 800 + Math.random() * 800;
      setTimeout(() => {
        if (hole.dataset.active === 'true') {
          hole.innerHTML = '';
          hole.dataset.active = 'false';
          hole.style.animation = '';
        }
      }, hideDelay);
    }

    const nextSpawn = Math.max(400, 1000 - (30 - whackTimeLeft) * 15);
    moleTimer = setTimeout(spawnMole, nextSpawn);
  }

  function startWhack() {
    whackScore = 0;
    whackTimeLeft = 30;
    whackRunning = true;
    if (scoreEl) scoreEl.textContent = 'Score: 0';
    if (timerEl) timerEl.textContent = 'Time: 30s';
    if (startBtn) startBtn.textContent = '🔨 Whacking...';

    holes.forEach(h => { h.innerHTML = ''; h.dataset.active = 'false'; });

    whackTimer = setInterval(() => {
      whackTimeLeft--;
      if (timerEl) timerEl.textContent = 'Time: ' + whackTimeLeft + 's';

      if (whackTimeLeft <= 0) {
        whackRunning = false;
        clearInterval(whackTimer);
        clearTimeout(moleTimer);
        holes.forEach(h => { h.innerHTML = ''; h.dataset.active = 'false'; h.style.animation = ''; });

        const endMessages = [
          `Exterminator rating: ${whackScore > 20 ? 'LEGENDARY' : whackScore > 10 ? 'Pretty Good' : 'Needs Practice'}`,
          `${whackScore} bugs squashed! QA would be proud.`,
          `Score: ${whackScore}. The bugs fear you now.`,
        ];
        if (scoreEl) scoreEl.textContent = endMessages[Math.floor(Math.random() * endMessages.length)];
        if (startBtn) startBtn.textContent = '🔨 Play Again';
      }
    }, 1000);

    spawnMole();
  }

  if (startBtn) {
    startBtn.addEventListener('click', startWhack);
  }
}


// =============================
// GAME 3: COOKIE CLICKER (MINI)
// =============================
function initCookieClicker(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let cookies = 0;
  let cps = 0; // cookies per second
  let clickPower = 1;

  const cookieEl = document.getElementById(containerId + '-cookie');
  const countEl = document.getElementById(containerId + '-count');
  const cpsEl = document.getElementById(containerId + '-cps');
  const upgradesEl = document.getElementById(containerId + '-upgrades');

  const upgrades = [
    { name: '🤖 Auto-Clicker', cost: 10, cpsAdd: 1, owned: 0 },
    { name: '🏭 Cookie Factory', cost: 50, cpsAdd: 5, owned: 0 },
    { name: '🚀 Cookie Rocket', cost: 200, cpsAdd: 20, owned: 0 },
    { name: '🌍 Cookie Planet', cost: 1000, cpsAdd: 100, owned: 0 },
    { name: '💪 Power Click (+1)', cost: 25, cpsAdd: 0, clickAdd: 1, owned: 0 },
  ];

  function render() {
    if (countEl) countEl.textContent = Math.floor(cookies).toLocaleString() + ' cookies';
    if (cpsEl) cpsEl.textContent = cps + ' cookies/sec | Click power: ' + clickPower;

    if (upgradesEl) {
      upgradesEl.innerHTML = upgrades.map((u, i) => `
        <button onclick="buyCookieUpgrade(${i})" style="
          display: block; width: 100%; margin: 3px 0; padding: 5px 8px;
          background: ${cookies >= u.cost ? '#003300' : '#1a1a1a'};
          border: 1px solid ${cookies >= u.cost ? '#39ff14' : '#333'};
          color: ${cookies >= u.cost ? '#39ff14' : '#666'};
          font-family: 'Silkscreen', monospace; font-size: 10px;
          cursor: ${cookies >= u.cost ? 'pointer' : 'not-allowed'};
          text-align: left;
        ">
          ${u.name} - Cost: ${u.cost} (Owned: ${u.owned})
        </button>
      `).join('');
    }
  }

  window.buyCookieUpgrade = function(idx) {
    const u = upgrades[idx];
    if (cookies < u.cost) return;
    cookies -= u.cost;
    u.owned++;
    u.cost = Math.floor(u.cost * 1.5);
    if (u.cpsAdd) cps += u.cpsAdd;
    if (u.clickAdd) clickPower += u.clickAdd;
    render();
  };

  if (cookieEl) {
    cookieEl.addEventListener('click', (e) => {
      cookies += clickPower;

      // Click effect
      const floater = document.createElement('div');
      floater.textContent = '+' + clickPower;
      floater.style.cssText = `
        position: absolute; pointer-events: none; z-index: 10;
        color: #FFD700; font-family: 'Press Start 2P', monospace; font-size: 16px;
        left: ${e.offsetX}px; top: ${e.offsetY}px;
        animation: float-score 0.6s ease-out forwards;
      `;
      cookieEl.parentElement.style.position = 'relative';
      cookieEl.parentElement.appendChild(floater);
      setTimeout(() => floater.remove(), 600);

      cookieEl.style.transform = 'scale(0.9)';
      setTimeout(() => cookieEl.style.transform = 'scale(1)', 100);

      render();
    });
  }

  // Auto cookies
  setInterval(() => {
    if (cps > 0) {
      cookies += cps / 10;
      render();
    }
  }, 100);

  render();
}

// Init games when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initSnakeGame('snake-canvas');
  initWhackGame('whack-game');
  initCookieClicker('cookie-game');
});
