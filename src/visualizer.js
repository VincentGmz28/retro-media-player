// ===============================
// CANVAS SETUP
// ===============================

const canvas = document.getElementById("vizCanvas");
const ctx = canvas.getContext("2d");

let vizMode = "retro"; // retro, tron, waveform

function setVisualizerMode(mode) {
  vizMode = mode;
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===============================
// REAL AUDIO VISUALIZER SETUP
// ===============================

const audio = document.getElementById("audio-player");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 256;

let source;

audio.addEventListener("play", () => {
  if (!source) {
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
  }
  audioContext.resume();
});

// ===============================
// THEME-AWARE COLOR SYSTEM
// ===============================

function getThemeColors() {
  const dark = document.body.classList.contains("dark-theme");

  return {
    retroBar: dark ? "#7dd3fc" : "#4fd1ff",
    tronBar: dark ? "#00bcd4" : "#00eaff",
    tronGlow: dark ? "#00bcd4" : "#00eaff",
    waveform: dark ? "#00ffcc" : "#00ff88",
    background: dark ? "#000" : "#111"
  };
}

// ===============================
// RETRO MODE (AUDIO REACTIVE BARS)
// ===============================

function drawRetroBars() {
  const colors = getThemeColors();

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteFrequencyData(dataArray);

  const bars = 40;
  const barWidth = canvas.width / bars;

  for (let i = 0; i < bars; i++) {
    const barHeight = dataArray[i];

    ctx.fillStyle = colors.retroBar;
    ctx.shadowBlur = 0;

    ctx.fillRect(
      i * barWidth,
      canvas.height - barHeight,
      barWidth - 2,
      barHeight
    );
  }
}

// ===============================
// TRON MODE (AUDIO REACTIVE BARS)
// ===============================

function drawTronBars() {
  const colors = getThemeColors();

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteFrequencyData(dataArray);

  const bars = 50;
  const barWidth = canvas.width / bars;

  for (let i = 0; i < bars; i++) {
    const barHeight = dataArray[i];

    ctx.fillStyle = colors.tronBar;
    ctx.shadowColor = colors.tronGlow;
    ctx.shadowBlur = 20;

    ctx.fillRect(
      i * barWidth,
      canvas.height - barHeight,
      barWidth - 2,
      barHeight
    );
  }
}

// ===============================
// WAVEFORM MODE (OSCILLOSCOPE)
// ===============================

function drawWaveform() {
  const colors = getThemeColors();

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bufferLength = analyzer.fftSize;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteTimeDomainData(dataArray);

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.waveform;

  ctx.beginPath();

  const sliceWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.stroke();
}

// ===============================
// MAIN ANIMATION LOOP
// ===============================

function animate() {
  if (vizMode === "tron") {
    drawTronBars();
  } else if (vizMode === "waveform") {
    drawWaveform();
  } else {
    drawRetroBars();
  }

  requestAnimationFrame(animate);
}

animate();