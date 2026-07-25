// ===============================
// VISUALIZER CORE SETUP
// ===============================

const audio = document.getElementById("audio-player");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Resize canvas to fit container
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Audio context + analyzer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyzer = audioCtx.createAnalyser();
analyzer.fftSize = 256;

const source = audioCtx.createMediaElementSource(audio);
source.connect(analyzer);
analyzer.connect(audioCtx.destination);

// Buffer for frequency data
const buffer = new Uint8Array(analyzer.frequencyBinCount);

// ===============================
// VISUALIZER MODES
// ===============================

function liquidBars() {
  analyzer.getByteFrequencyData(buffer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / buffer.length;

  for (let i = 0; i < buffer.length; i++) {
    const barHeight = buffer[i] * 1.2;
    const x = i * barWidth;
    const y = canvas.height - barHeight;

    ctx.fillStyle = "rgba(0, 200, 255, 0.8)";
    ctx.fillRect(x, y, barWidth - 2, barHeight);
  }
}

function oceanWaves() {
  analyzer.getByteFrequencyData(buffer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let i = 0; i < buffer.length; i++) {
    const x = (i / buffer.length) * canvas.width;
    const y = canvas.height / 2 - buffer[i] * 0.8;
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "#00aaff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function barsAndWaves() {
  analyzer.getByteFrequencyData(buffer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / buffer.length;
  for (let i = 0; i < buffer.length; i++) {
    const barHeight = buffer[i];
    ctx.fillStyle = "#ffaa00";
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
  }

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  for (let i = 0; i < buffer.length; i++) {
    const x = (i / buffer.length) * canvas.width;
    const y = canvas.height / 2 - buffer[i] * 0.5;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function tronGrid() {
  analyzer.getByteFrequencyData(buffer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 1;

  for (let i = 0; i < buffer.length; i++) {
    const x = (i / buffer.length) * canvas.width;
    const y = canvas.height - buffer[i] * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function barbieSparkle() {
  analyzer.getByteFrequencyData(buffer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < buffer.length; i++) {
    const size = buffer[i] * 0.4;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    ctx.fillStyle = "rgba(255, 105, 180, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function discoGrid() {
  analyzer.getByteFrequencyData(buffer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gridSize = 20;

  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      const index = Math.floor((x + y) % buffer.length);
      const brightness = buffer[index];

      ctx.fillStyle = `rgba(${brightness}, 0, ${255 - brightness}, 0.9)`;
      ctx.fillRect(x, y, gridSize, gridSize);
    }
  }
}

// ===============================
// MODE SWITCHING
// ===============================

let currentMode = liquidBars;

export function setVisualizerMode(modeName) {
  const modes = {
    liquidBars,
    oceanWaves,
    barsAndWaves,
    tronGrid,
    barbieSparkle,
    discoGrid
  };

  currentMode = modes[modeName] || liquidBars;
}

// ===============================
// DRAW LOOP
// ===============================

function draw() {
  requestAnimationFrame(draw);
  currentMode();
}

draw();
