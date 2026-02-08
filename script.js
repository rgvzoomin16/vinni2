const phases = Array.from(document.querySelectorAll(".phase"));

const typingLines = [
  "Accessing heart",
  "SCANNING EMOTIONAL DATA…",
  "HEART STATUS: COMPROMISED",
  "REASON: [Vinni]",
];

const typingContainer = document.getElementById("typing");
const flash = document.getElementById("flash");
const identified = document.getElementById("identified");
const continue1 = document.getElementById("continue-1");
const continue2 = document.getElementById("continue-2");
const continue3 = document.getElementById("continue-3");
const slides = document.getElementById("slides");
const conclusion = document.getElementById("conclusion");
const playButton = document.getElementById("play");
const trailer = document.getElementById("trailer");
const countdownEl = document.getElementById("countdown");
const heart = document.getElementById("heart");
const gameStatus = document.getElementById("game-status");
const confetti = document.getElementById("confetti");

let currentPhase = 0;
let clicks = 0;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (frequency, duration = 0.2, type = "sine") => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

const playHeartbeat = () => {
  playTone(110, 0.15, "sine");
  setTimeout(() => playTone(90, 0.2, "sine"), 180);
};

const showPhase = (index) => {
  phases[currentPhase].classList.remove("active");
  currentPhase = index;
  phases[currentPhase].classList.add("active");
  if (currentPhase === 5) {
    startCountdown();
  }
};

const typeLines = async () => {
  for (const line of typingLines) {
    const p = document.createElement("p");
    typingContainer.appendChild(p);
    for (let i = 0; i < line.length; i += 1) {
      p.textContent += line[i];
      await new Promise((resolve) => setTimeout(resolve, 45));
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  flash.classList.add("active");
  setTimeout(() => {
    flash.classList.remove("active");
    identified.hidden = false;
    continue1.hidden = false;
  }, 900);
};

const runMemoryScan = () => {
  setTimeout(() => {
    slides.hidden = false;
    setTimeout(() => {
      conclusion.hidden = false;
      continue2.hidden = false;
    }, 2600);
  }, 2200);
};

const startCountdown = () => {
  let count = 10;
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count -= 1;
    if (count < 0) {
      clearInterval(interval);
      showPhase(6);
    } else {
      countdownEl.textContent = count;
      playTone(220, 0.08, "triangle");
    }
  }, 700);
};

const randomPosition = () => {
  const area = document.getElementById("game-area");
  const maxX = area.clientWidth - 40;
  const maxY = area.clientHeight - 40;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
};

const launchConfetti = () => {
  confetti.innerHTML = "";
  for (let i = 0; i < 70; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 2}s`;
    piece.style.background = `hsl(${Math.random() * 360}, 80%, 70%)`;
    confetti.appendChild(piece);
  }
};

const addConfettiStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .confetti-piece {
      position: absolute;
      top: -10px;
      width: 10px;
      height: 16px;
      animation: fall 3s linear infinite;
      opacity: 0.8;
    }
    @keyframes fall {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(80vh) rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

addConfettiStyles();
randomPosition();

continue1.addEventListener("click", () => {
  showPhase(1);
  runMemoryScan();
});

continue2.addEventListener("click", () => {
  showPhase(2);
  playHeartbeat();
});

continue3.addEventListener("click", () => {
  showPhase(3);
  playTone(440, 0.2, "triangle");
});

heart.addEventListener("click", () => {
  clicks += 1;
  playTone(520, 0.1, "square");
  gameStatus.textContent = `Clicks: ${clicks} / 5`;
  randomPosition();
  if (clicks >= 5) {
    gameStatus.textContent = "Heart successfully captured by [Vinni]. Ownership permanent.";
    setTimeout(() => showPhase(4), 1200);
  }
});

playButton.addEventListener("click", () => {
  trailer.hidden = false;
  playTone(330, 0.2, "sine");
  setTimeout(() => showPhase(5), 2600);
});

const yesButtons = [document.getElementById("yes-1"), document.getElementById("yes-2")];

yesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPhase(7);
    launchConfetti();
    playTone(660, 0.4, "triangle");
  });
});

window.addEventListener("load", () => {
  typeLines();
});

window.addEventListener("click", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
});

showPhase(0);
