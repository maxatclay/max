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

// =============================
// GAME 4: DINO RUN
// =============================
function initDinoGame(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width;
  const H = canvas.height;
  const GROUND = H - 30;

  const scoreEl = document.getElementById('dino-game-score');
  const startBtn = document.getElementById('dino-game-start');

  let gameRunning = false;
  let animFrame = null;
  let lastTime = 0;
  let score = 0;
  let speed = 5;
  let frameCount = 0;

  // Dino
  const dino = {
    x: 60,
    y: GROUND,
    w: 40,
    h: 50,
    vy: 0,
    ducking: false,
    jumping: false,
    legFrame: 0,
  };

  // Obstacles
  let obstacles = [];
  let nextObstacle = 80;

  // Clouds
  let clouds = [
    { x: 150, y: 30, w: 60 },
    { x: 350, y: 20, w: 80 },
  ];

  function resetGame() {
    score = 0;
    speed = 5;
    frameCount = 0;
    obstacles = [];
    nextObstacle = 80;
    dino.y = GROUND;
    dino.vy = 0;
    dino.ducking = false;
    dino.jumping = false;
    clouds = [{ x: 150, y: 30, w: 60 }, { x: 350, y: 20, w: 80 }];
  }

  function jump() {
    if (!dino.jumping && !dino.ducking) {
      dino.vy = -14;
      dino.jumping = true;
    }
  }

  function duck(on) {
    if (!dino.jumping) dino.ducking = on;
  }

  function spawnObstacle() {
    const type = Math.random() > 0.25 ? 'cactus' : 'bird';
    if (type === 'cactus') {
      const h = 30 + Math.floor(Math.random() * 25);
      obstacles.push({ type: 'cactus', x: W + 10, y: GROUND, w: 20, h });
    } else {
      const birdY = GROUND - 30 - Math.floor(Math.random() * 40);
      obstacles.push({ type: 'bird', x: W + 10, y: birdY, w: 36, h: 24, wing: 0 });
    }
    nextObstacle = 60 + Math.floor(Math.random() * 80);
  }

  function drawDino() {
    const x = dino.x;
    const y = dino.ducking ? GROUND - 28 : dino.y - dino.h;
    const dh = dino.ducking ? 28 : dino.h;
    const dw = dino.ducking ? 55 : dino.w;

    ctx.fillStyle = '#39ff14';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 6;

    if (dino.ducking) {
      // Ducking body (long and low)
      ctx.fillRect(x, y, dw, dh);
      // Eye
      ctx.fillStyle = '#000';
      ctx.shadowBlur = 0;
      ctx.fillRect(x + dw - 10, y + 6, 6, 6);
      // Tail
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 4;
      ctx.fillRect(x - 12, y + 10, 14, 10);
    } else {
      // Body
      ctx.fillRect(x, y + 14, dw, dh - 14);
      // Head
      ctx.fillRect(x + 6, y, dw - 4, 18);
      // Eye
      ctx.fillStyle = '#000';
      ctx.shadowBlur = 0;
      ctx.fillRect(x + dw - 8, y + 4, 6, 6);
      // Mouth
      ctx.fillStyle = '#000';
      ctx.fillRect(x + dw, y + 12, 4, 3);
      // Tail
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 4;
      ctx.fillRect(x - 12, y + 28, 14, 10);
      // Legs (animated when running)
      ctx.fillStyle = '#39ff14';
      if (!dino.jumping) {
        const legOff = Math.floor(frameCount / 6) % 2;
        ctx.fillRect(x + 4, y + dh - 14, 10, legOff === 0 ? 16 : 10);
        ctx.fillRect(x + dw - 12, y + dh - 14, 10, legOff === 1 ? 16 : 10);
      } else {
        ctx.fillRect(x + 4, y + dh - 14, 10, 10);
        ctx.fillRect(x + dw - 12, y + dh - 14, 10, 14);
      }
    }
    ctx.shadowBlur = 0;
  }

  function drawObstacle(obs) {
    ctx.shadowBlur = 5;
    if (obs.type === 'cactus') {
      ctx.fillStyle = '#ff6600';
      ctx.shadowColor = '#ff6600';
      // Main stem
      ctx.fillRect(obs.x + 7, obs.y - obs.h, 6, obs.h);
      // Arms
      const armH = Math.floor(obs.h * 0.4);
      ctx.fillRect(obs.x, obs.y - armH - 8, 20, 6);
      ctx.fillRect(obs.x, obs.y - armH - 16, 6, 12);
      ctx.fillRect(obs.x + 14, obs.y - armH - 16, 6, 12);
    } else {
      // Bird
      ctx.fillStyle = '#ff00ff';
      ctx.shadowColor = '#ff00ff';
      ctx.fillRect(obs.x, obs.y + 8, obs.w, 10);
      // Wings flap
      const wingUp = Math.floor(frameCount / 8) % 2 === 0;
      ctx.fillRect(obs.x + 6, wingUp ? obs.y : obs.y + 6, 24, 8);
      // Beak
      ctx.fillRect(obs.x + obs.w, obs.y + 10, 8, 4);
      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(obs.x + obs.w - 8, obs.y + 9, 4, 4);
    }
    ctx.shadowBlur = 0;
  }

  function drawGround() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, GROUND, W, 2);
    // Dashes
    ctx.fillStyle = '#444';
    for (let i = 0; i < W; i += 40) {
      ctx.fillRect((i + (frameCount * speed) % 40 * -1 + 40) % W, GROUND + 6, 20, 2);
    }
  }

  function drawClouds() {
    ctx.fillStyle = '#1a1a2e';
    for (const c of clouds) {
      ctx.shadowColor = '#9999ff';
      ctx.shadowBlur = 4;
      ctx.fillRect(c.x, c.y, c.w, 12);
      ctx.fillRect(c.x + 10, c.y - 8, c.w - 20, 10);
    }
    ctx.shadowBlur = 0;
  }

  function checkCollision(obs) {
    const dinoX = dino.x + 4;
    const dinoY = dino.ducking ? GROUND - 28 : dino.y - dino.h + 4;
    const dinoW = dino.ducking ? 50 : dino.w - 6;
    const dinoH = dino.ducking ? 24 : dino.h - 8;

    const obsX = obs.type === 'cactus' ? obs.x + 2 : obs.x;
    const obsY = obs.type === 'cactus' ? obs.y - obs.h : obs.y;
    const obsW = obs.type === 'cactus' ? obs.w - 4 : obs.w;
    const obsH = obs.type === 'cactus' ? obs.h : obs.h;

    return (
      dinoX < obsX + obsW &&
      dinoX + dinoW > obsX &&
      dinoY < obsY + obsH &&
      dinoY + dinoH > obsY
    );
  }

  function gameLoop(ts) {
    if (!gameRunning) return;
    const dt = Math.min(ts - lastTime, 50);
    lastTime = ts;
    frameCount++;

    // Physics
    dino.vy += 0.7;
    dino.y += dino.vy;
    if (dino.y >= GROUND) {
      dino.y = GROUND;
      dino.vy = 0;
      dino.jumping = false;
    }

    // Obstacles
    nextObstacle--;
    if (nextObstacle <= 0) spawnObstacle();
    for (const obs of obstacles) obs.x -= speed;
    obstacles = obstacles.filter(o => o.x > -60);

    // Clouds
    for (const c of clouds) c.x -= 1;
    clouds = clouds.filter(c => c.x > -100);
    if (clouds.length < 2 && Math.random() < 0.005) {
      clouds.push({ x: W + 10, y: 15 + Math.floor(Math.random() * 35), w: 50 + Math.floor(Math.random() * 50) });
    }

    // Score & speed
    score++;
    speed = 5 + Math.floor(score / 300) * 0.5;
    if (scoreEl) scoreEl.textContent = 'Score: ' + Math.floor(score / 5);

    // Collision
    for (const obs of obstacles) {
      if (checkCollision(obs)) {
        gameOver();
        return;
      }
    }

    // Draw
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    drawClouds();
    drawGround();
    for (const obs of obstacles) drawObstacle(obs);
    drawDino();

    animFrame = requestAnimationFrame(gameLoop);
  }

  function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animFrame);
    if (startBtn) startBtn.textContent = '&#129430; Play Again';

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillStyle = '#ff00ff';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 10);
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('Score: ' + Math.floor(score / 5), W / 2, H / 2 + 12);

    const msgs = [
      'Even the offline dino has wifi now. Skill issue.',
      'The cactus wins. As always.',
      'Error 404: Survival not found.',
      'The bots would have dodged that.',
    ];
    if (scoreEl) scoreEl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
  }

  function startGame() {
    resetGame();
    gameRunning = true;
    if (startBtn) startBtn.textContent = '&#129430; Running...';
    if (scoreEl) scoreEl.textContent = 'Score: 0';
    lastTime = performance.now();
    animFrame = requestAnimationFrame(gameLoop);
  }

  // Draw idle screen
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#333';
  ctx.fillRect(0, GROUND, W, 2);
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.fillStyle = '#39ff14';
  ctx.textAlign = 'center';
  ctx.fillText('PRESS START', W / 2, H / 2);

  if (startBtn) startBtn.addEventListener('click', startGame);

  // Controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); duck(true); }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') duck(false);
  });
  // Tap to jump on mobile
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); });
}

// Init games when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initSnakeGame('snake-canvas');
  initWhackGame('whack-game');
  initCookieClicker('cookie-game');
  initDinoGame('dino-canvas');
});
