/* ============================================
   SHARED EFFECTS ENGINE
   "We put the FUN in dysFUNctional"
   ============================================ */

// === SPARKLE CURSOR TRAIL ===
const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '✴️', '🔥', '💖', '⚡'];
let sparkleThrottle = 0;

document.addEventListener('mousemove', (e) => {
  sparkleThrottle++;
  if (sparkleThrottle % 3 !== 0) return;

  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
  sparkle.style.left = (e.clientX + (Math.random() - 0.5) * 20) + 'px';
  sparkle.style.top = (e.clientY + (Math.random() - 0.5) * 20) + 'px';
  sparkle.style.fontSize = (12 + Math.random() * 16) + 'px';
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 800);
});

// === SNOWFALL (but make it emojis) ===
const snowEmojis = ['❄️', '🌸', '⭐', '✨', '🦋', '🌈', '💎', '🎀', '🍕'];

function createSnowflake() {
  const flake = document.createElement('div');
  flake.className = 'snowflake';
  flake.textContent = snowEmojis[Math.floor(Math.random() * snowEmojis.length)];
  flake.style.left = Math.random() * 100 + 'vw';
  flake.style.fontSize = (14 + Math.random() * 20) + 'px';
  flake.style.animationDuration = (4 + Math.random() * 6) + 's';
  flake.style.opacity = 0.4 + Math.random() * 0.6;
  document.body.appendChild(flake);

  setTimeout(() => flake.remove(), 10000);
}

setInterval(createSnowflake, 600);

// === FLOATING EMOJIS FROM BOTTOM ===
const floatEmojis = ['🚀', '🔥', '💯', '🎉', '🤖', '🧠', '💰', '⚡', '🎸', '👾'];

function createFloatingEmoji() {
  const emoji = document.createElement('div');
  emoji.className = 'floating-emoji';
  emoji.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
  emoji.style.left = Math.random() * 100 + 'vw';
  emoji.style.animationDuration = (4 + Math.random() * 4) + 's';
  document.body.appendChild(emoji);

  setTimeout(() => emoji.remove(), 8000);
}

setInterval(createFloatingEmoji, 2000);

// === EYES THAT FOLLOW MOUSE ===
function initEyes() {
  const eyes = document.querySelectorAll('.eye');

  document.addEventListener('mousemove', (e) => {
    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const maxDist = 10;
      const dist = Math.min(
        Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10,
        maxDist
      );

      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });
}

// === FAKE POPUP SYSTEM ===
const popupMessages = [
  { title: 'CONGRATULATIONS!!!', icon: '🎉', message: 'You are the 1,000,000th visitor to this page!!!', buttons: ['Claim Prize', 'Claim BIGGER Prize'] },
  { title: 'Warning', icon: '⚠️', message: 'Your computer has been infected with TOO MUCH SWAG', buttons: ['OK', 'More Swag Please'] },
  { title: 'System Alert', icon: '🤖', message: 'AI has detected that you are AWESOME. No action needed.', buttons: ['I Know', 'Tell Me More'] },
  { title: 'Hot Singles Alert', icon: '🔥', message: 'Hot GTM Engineers in your area want to optimize your funnel!', buttons: ['Optimize Now', 'My Funnel Is Fine'] },
  { title: 'Clippy Says:', icon: '📎', message: 'It looks like you\'re trying to browse a website. Would you like help with that?', buttons: ['Yes Please', 'Go Away Clippy'] },
  { title: 'Free Download!!!', icon: '💿', message: 'Download more RAM for FREE! (only 420 easy payments of $0.01)', buttons: ['DOWNLOAD', 'I Need More RAM'] },
  { title: 'Security Warning', icon: '🛡️', message: 'This website is protected by WEB 1.0 SECURITY STANDARDS (aka nothing)', buttons: ['Cool', 'I Feel Safe'] },
];

let popupCount = 0;
const MAX_POPUPS = 3;

function showFakePopup() {
  if (popupCount >= MAX_POPUPS) return;

  const msg = popupMessages[Math.floor(Math.random() * popupMessages.length)];
  const popup = document.createElement('div');
  popup.className = 'fake-popup active';
  popup.style.top = (50 + Math.random() * 300) + 'px';
  popup.style.left = (50 + Math.random() * (window.innerWidth - 450)) + 'px';

  popup.innerHTML = `
    <div class="fake-popup-titlebar">
      <span>${msg.title}</span>
      <span class="close-btn" onclick="this.closest('.fake-popup').remove(); popupCount--;">X</span>
    </div>
    <div class="fake-popup-body">
      <div class="popup-icon">${msg.icon}</div>
      <p>${msg.message}</p>
      ${msg.buttons.map(b => `<button onclick="this.closest('.fake-popup').remove(); popupCount--; showFakePopup();">${b}</button>`).join(' ')}
    </div>
  `;

  document.body.appendChild(popup);
  popupCount++;

  // Make it draggable
  makeDraggable(popup);
}

function makeDraggable(el) {
  const titlebar = el.querySelector('.fake-popup-titlebar');
  let offsetX, offsetY, isDragging = false;

  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = 10000 + popupCount;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    el.style.left = (e.clientX - offsetX) + 'px';
    el.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// Show first popup after 5 seconds, then randomly
setTimeout(showFakePopup, 5000);
setTimeout(showFakePopup, 15000);
setTimeout(showFakePopup, 30000);

// === VISITOR COUNTER (FAKE, obviously) ===
function initVisitorCounter() {
  const counter = document.getElementById('visitor-count');
  if (!counter) return;

  // Generate a convincingly fake number
  let count = 48173 + Math.floor(Math.random() * 1000);
  const digits = counter.querySelectorAll('.odo-digit');

  function updateCounter() {
    count += Math.floor(Math.random() * 3);
    const str = count.toString().padStart(digits.length, '0');
    digits.forEach((d, i) => {
      d.textContent = str[i];
    });
  }

  updateCounter();
  setInterval(updateCounter, 3000 + Math.random() * 5000);
}

// === DANCING LETTERS ===
function initDancingLetters() {
  document.querySelectorAll('.dance-text').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'dance-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = (i * 0.08) + 's';
      // Random colors per letter
      const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
      span.style.color = colors[i % colors.length];
      el.appendChild(span);
    });
  });
}

// === MATRIX RAIN BACKGROUND ===
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = 'アイウエオカキクケコサシスセソタチツテトCLAYGTM01BOTSCODE';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// === KONAMI CODE EASTER EGG ===
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      activateKonamiMode();
    }
  } else {
    konamiIndex = 0;
  }
});

function activateKonamiMode() {
  document.body.style.animation = 'spin360 2s linear';
  setTimeout(() => {
    document.body.style.animation = '';
    // Spawn 50 emojis
    for (let i = 0; i < 50; i++) {
      setTimeout(createFloatingEmoji, i * 50);
    }
    // Show special popup
    const popup = document.createElement('div');
    popup.className = 'fake-popup active';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.innerHTML = `
      <div class="fake-popup-titlebar">
        <span>SECRET UNLOCKED!!! 🎮</span>
        <span class="close-btn" onclick="this.closest('.fake-popup').remove();">X</span>
      </div>
      <div class="fake-popup-body">
        <div class="popup-icon">🏆</div>
        <p style="font-size:16px;"><b>YOU FOUND THE KONAMI CODE!</b><br>You are now a certified 1337 h4x0r</p>
        <button onclick="this.closest('.fake-popup').remove();">I AM THE CHOSEN ONE</button>
      </div>
    `;
    document.body.appendChild(popup);
    makeDraggable(popup);
  }, 2000);
}

// === RIGHT-CLICK TROLL ===
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const popup = document.createElement('div');
  popup.className = 'fake-popup active';
  popup.style.top = e.clientY + 'px';
  popup.style.left = Math.min(e.clientX, window.innerWidth - 350) + 'px';
  popup.innerHTML = `
    <div class="fake-popup-titlebar">
      <span>Nice Try! 😏</span>
      <span class="close-btn" onclick="this.closest('.fake-popup').remove();">X</span>
    </div>
    <div class="fake-popup-body">
      <div class="popup-icon">🚫</div>
      <p>You cannot steal my <b>epic HTML code</b>!<br>This site is protected by <i>Web 1.0 DRM</i>.</p>
      <button onclick="this.closest('.fake-popup').remove();">I'm Sorry</button>
    </div>
  `;
  document.body.appendChild(popup);
  makeDraggable(popup);
});

// === INIT ALL EFFECTS ===
document.addEventListener('DOMContentLoaded', () => {
  initEyes();
  initVisitorCounter();
  initDancingLetters();
  initMatrixRain();

  // Start with a welcome "popup"
  setTimeout(() => {
    const welcomePopup = document.createElement('div');
    welcomePopup.className = 'fake-popup active';
    welcomePopup.style.top = '100px';
    welcomePopup.style.left = Math.max(50, (window.innerWidth / 2) - 200) + 'px';
    welcomePopup.innerHTML = `
      <div class="fake-popup-titlebar">
        <span>Welcome to the INFORMATION SUPERHIGHWAY!</span>
        <span class="close-btn" onclick="this.closest('.fake-popup').remove();">X</span>
      </div>
      <div class="fake-popup-body">
        <div class="popup-icon">🌐</div>
        <p><b>Welcome, traveler!</b><br>You have reached the WORLD WIDE WEB.<br>Please set your resolution to 800x600 for the best experience.</p>
        <button onclick="this.closest('.fake-popup').remove();">Enter the Cyber Zone</button>
      </div>
    `;
    document.body.appendChild(welcomePopup);
    makeDraggable(welcomePopup);
  }, 1500);
});
