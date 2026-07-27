// ===============================
// RETRO MEDIA PLAYER FEATURE ENGINE
// ===============================

// Grab elements
const audio = document.getElementById("audio-player");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

// ===============================
// PLAYLIST SYSTEM
// ===============================

const songs = [
  {
    title: "Lose Yourself to Dance",
    artist: "Daft Punk",
    file: "Daft Punk - Lose Yourself to Dance (Official Version).mp3"
  },
  {
    title: "So Long, London",
    artist: "Taylor Swift",
    file: "Taylor Swift - So Long, London (Official Lyric Video).mp3"
  }
];

let currentTrack = 0;

function loadTrack(index) {
  currentTrack = index;
  const track = songs[currentTrack];

  audio.src = track.file;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;

  audio.play();
}

loadTrack(0);

// ===============================
// PLAYER BUTTONS
// ===============================

document.getElementById("play-btn").onclick = () => audio.play();
document.getElementById("pause-btn").onclick = () => audio.pause();

document.getElementById("stop-btn").onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

document.getElementById("next-btn").onclick = () => {
  currentTrack = (currentTrack + 1) % songs.length;
  loadTrack(currentTrack);
};

document.getElementById("prev-btn").onclick = () => {
  currentTrack = (currentTrack - 1 + songs.length) % songs.length;
  loadTrack(currentTrack);
};

let repeatEnabled = false;
document.getElementById("repeat-btn").onclick = () => {
  repeatEnabled = !repeatEnabled;
  audio.loop = repeatEnabled;
};

audio.onended = () => {
  if (!repeatEnabled) {
    currentTrack = (currentTrack + 1) % songs.length;
    loadTrack(currentTrack);
  }
};

// ===============================
// SEEK BAR + TIME DISPLAY
// ===============================

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
  }
});

seekBar.addEventListener("input", () => {
  const newTime = (seekBar.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

// ===============================
// VOLUME CONTROL
// ===============================

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

// ===============================
// TIME FORMATTER
// ===============================

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ===============================
// VISUALIZER ENGINE
// ===============================

const audioElement = audio;

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let audioCtx;
let analyser;
let source;

function initVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();

        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.85;

        source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
}

let mode = "wave";

document.addEventListener("DOMContentLoaded", () => {
  const modeSelector = document.getElementById("visualizer-mode");
  if (modeSelector) {
    modeSelector.addEventListener("change", (e) => {
      mode = e.target.value;
    });
  }
});

// ===============================
// COLOR CYCLING ENGINE (gentle)
// ===============================

let hue = 200;
function nextColor() {
  hue = (hue + 0.1) % 360;
  return `hsl(${hue}, 45%, 70%)`;
}

// ===============================
// MOTION BLUR TRAIL
// ===============================

function applyMotionBlur() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ===============================
// VISUALIZER #1 — WAVEFORM
// ===============================

function drawWave() {
    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    applyMotionBlur();

    ctx.lineWidth = 2;
    ctx.strokeStyle = nextColor();
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.strokeStyle;

    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    const centerY = canvas.height / 2;
    const amplitude = canvas.height * 0.25;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = centerY + (v - 1) * amplitude;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.quadraticCurveTo(x - sliceWidth, y, x, y);
        }

        x += sliceWidth;
    }

    ctx.stroke();
}

// ===============================
// VISUALIZER #2 — BARS
// ===============================

function drawBars() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    applyMotionBlur();

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];

        ctx.fillStyle = nextColor();
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// ===============================
// VISUALIZER #3 — RADIAL BURST
// ===============================

function drawRadialBurst() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    applyMotionBlur();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    const spin = Date.now() / 3000;
    ctx.rotate(spin);

    ctx.shadowBlur = 20;
    ctx.shadowColor = nextColor();

    for (let i = 0; i < bufferLength; i += 8) {
        const value = dataArray[i];
        const angle = (i / bufferLength) * Math.PI * 2;
        const length = value * 1.2;

        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;

        ctx.strokeStyle = nextColor();
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    ctx.restore();
}

// ===============================
// VISUALIZER #4 — ENERGY ORB
// ===============================

function drawEnergyOrb() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    applyMotionBlur();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const bass = dataArray[1] / 255;
    const treble = dataArray[bufferLength - 1] / 255;

    const wobble = Math.sin(Date.now() / 200) * 5;
    const radius = 40 + bass * 60 + wobble;

    ctx.shadowBlur = 30;
    ctx.shadowColor = nextColor();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + treble * 40, 0, Math.PI * 2);
    ctx.strokeStyle = nextColor();
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = nextColor();
    ctx.fill();
}

// ===============================
// UNIFIED ANIMATION LOOP
// ===============================

function animate() {
    requestAnimationFrame(animate);

    if (mode === "wave") drawWave();
    if (mode === "bars") drawBars();
    if (mode === "circle") drawRadialBurst();
    if (mode === "dots") drawEnergyOrb();
}

audioElement.addEventListener("play", () => {
    initVisualizer();
    animate();
});

audioElement.addEventListener("pause", () => {
    if (audioCtx && audioCtx.state === "running") {
        audioCtx.suspend();
    }
});

audioElement.addEventListener("play", () => {
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
});

// ===============================
// ⭐ THEME SWITCHER (FIX)
// ===============================

const themes = ["classic-theme", "tron-theme", "barbie-theme"];

function applyTheme(theme) {
  themes.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(theme);
}

document.getElementById("theme-classic").onclick = () => applyTheme("classic-theme");
document.getElementById("theme-tron").onclick = () => applyTheme("tron-theme");
document.getElementById("theme-barbie").onclick = () => applyTheme("barbie-theme");
