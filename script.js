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

const playlist = [
  {
    title: "Lose Yourself to Dance",
    artist: "Daft Punk",
    file: "Daft Punk - Lose Yourself to Dance (Official Version).mp3"
  }
];

let currentTrack = 0;

function loadTrack(index) {
  currentTrack = index;
  const track = playlist[currentTrack];

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
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
};

document.getElementById("prev-btn").onclick = () => {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
};

let repeatEnabled = false;
document.getElementById("repeat-btn").onclick = () => {
  repeatEnabled = !repeatEnabled;
  audio.loop = repeatEnabled;
};

audio.onended = () => {
  if (!repeatEnabled) {
    currentTrack = (currentTrack + 1) % playlist.length;
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

// ⭐ MODE SYSTEM
let mode = "wave";

// ⭐ FIX ADDED — GUARANTEES DROPDOWN WORKS
document.addEventListener("DOMContentLoaded", () => {
  const modeSelector = document.getElementById("visualizer-mode");
  if (modeSelector) {
    modeSelector.addEventListener("change", (e) => {
      mode = e.target.value;
    });
  }
});

// ===============================
// VISUALIZER #1 — WAVEFORM
// ===============================

function drawWave() {
    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00eaff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00eaff";

    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];

        ctx.fillStyle = "#00ff88";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// ===============================
// VISUALIZER #3 — CIRCLE
// ===============================

function drawCircle() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = 40 + dataArray[10] / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ff1493";
    ctx.lineWidth = 4;
    ctx.stroke();
}

// ===============================
// VISUALIZER #4 — DOTS
// ===============================

function drawDots() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spacing = canvas.width / bufferLength;

    for (let i = 0; i < bufferLength; i += 5) {
        const value = dataArray[i];
        const percent = value / 255;
        const y = canvas.height - canvas.height * percent;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(i * spacing, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===============================
// UNIFIED ANIMATION LOOP
// ===============================

function animate() {
    requestAnimationFrame(animate);

    if (mode === "wave") drawWave();
    if (mode === "bars") drawBars();
    if (mode === "circle") drawCircle();
    if (mode === "dots") drawDots();
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