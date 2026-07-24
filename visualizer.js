const audioPlayer = document.getElementById("audio-player");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Audio setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 512;

const source = audioCtx.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// MODE SYSTEM
let mode = "liquidBars"; // default mode

export function setVisualizerMode(newMode) {
  mode = newMode;
}

// MAIN DRAW LOOP
function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  switch (mode) {
    case "liquidBars":
      drawLiquidBars(dataArray, bufferLength);
      break;

    case "barsAndWaves":
      drawBarsAndWaves(dataArray, bufferLength);
      break;

    case "rayOfLight":
      drawRayOfLight(dataArray, bufferLength);
      break;

    case "discoGrid":
      drawDiscoGrid(dataArray, bufferLength);
      break;

    case "tronGrid":
      drawTronGrid(dataArray, bufferLength);
      break;

    case "oceanWaves":
      drawOceanWaves(dataArray, bufferLength);
      break;

    case "barbieSparkle":
      drawBarbieSparkle(dataArray, bufferLength);
      break;
  }
}

// ------------------------------------------------------------
// MODE 1 — LIQUID NEON BARS (WMP Energy Bliss + Madonna Neon)
// ------------------------------------------------------------
let hue = 200;

function drawLiquidBars(dataArray, bufferLength) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  hue += 0.3;
  if (hue > 360) hue = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 1.2;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `hsl(${hue}, 90%, 70%)`);
    gradient.addColorStop(1, `hsl(${hue + 40}, 90%, 40%)`);

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(
      x,
      canvas.height - barHeight,
      barWidth,
      barHeight,
      10
    );
    ctx.fill();

    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

    x += barWidth + 1;
  }
}

// ------------------------------------------------------------
// MODE 2 — WMP BARS & WAVES (Classic Windows Media Player)
// ------------------------------------------------------------
function drawBarsAndWaves(dataArray, bufferLength) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 1.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];

    ctx.fillStyle = "#3a4b6b";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }

  ctx.beginPath();
  ctx.strokeStyle = "#6a7a99";
  ctx.lineWidth = 2;

  let waveX = 0;
  for (let i = 0; i < bufferLength; i++) {
    const y = canvas.height - dataArray[i] * 0.5;
    ctx.lineTo(waveX, y);
    waveX += barWidth + 1;
  }
  ctx.stroke();
}

// ------------------------------------------------------------
// MODE 3 — MADONNA RAY OF LIGHT (Radial Burst)
// ------------------------------------------------------------
function drawRayOfLight(dataArray, bufferLength) {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i];
    const angle = (i / bufferLength) * Math.PI * 2;
    const length = value * 1.5;

    ctx.strokeStyle = `hsl(${(i * 3) % 360}, 90%, 60%)`;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * length,
      centerY + Math.sin(angle) * length
    );
    ctx.stroke();
  }
}

// ------------------------------------------------------------
// MODE 4 — CONFESSIONS TOUR DISCO GRID (Neon Squares)
// ------------------------------------------------------------
function drawDiscoGrid(dataArray, bufferLength) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gridSize = 20;
  let index = 0;

  for (let y = 0; y < canvas.height; y += gridSize) {
    for (let x = 0; x < canvas.width; x += gridSize) {
      const value = dataArray[index % bufferLength];
      const brightness = value / 255;

      ctx.fillStyle = `rgba(255, 0, 150, ${brightness})`;
      ctx.fillRect(x, y, gridSize - 2, gridSize - 2);

      index++;
    }
  }
}

// ------------------------------------------------------------
// MODE 5 — TRON NEON GRID (Blue Laser Lines)
// ------------------------------------------------------------
function drawTronGrid(dataArray, bufferLength) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#00aaff";
  ctx.lineWidth = 1;

  const spacing = 25;

  for (let x = 0; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#00aaff";
  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i];
    const x = (i * spacing) % canvas.width;
    const y = (i * spacing) % canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, value * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ------------------------------------------------------------
// MODE 6 — OCEAN WAVES (Liquid Sine Waves)
// ------------------------------------------------------------
function drawOceanWaves(dataArray, bufferLength) {
  ctx.fillStyle = "rgba(0,0,30,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = "#7fb3d5";
  ctx.lineWidth = 3;

  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const y = canvas.height / 2 + Math.sin(i * 0.2) * dataArray[i] * 0.3;
    ctx.lineTo(x, y);
    x += canvas.width / bufferLength;
  }
  ctx.stroke();
}

// ------------------------------------------------------------
// MODE 7 — BARBIE SPARKLE (Pink Glitter)
// ------------------------------------------------------------
function drawBarbieSparkle(dataArray, bufferLength) {
  ctx.fillStyle = "rgba(255, 200, 220, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    ctx.fillStyle = `rgba(255, 105, 180, ${value / 255})`;
    ctx.beginPath();
    ctx.arc(x, y, value * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ------------------------------------------------------------
// START VISUALIZER ON PLAY
// ------------------------------------------------------------
audioPlayer.onplay = () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  drawVisualizer();
};
