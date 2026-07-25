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

// Add your songs here (root-level files)
const playlist = [
  {
    title: "Lose Yourself to Dance",
    artist: "Daft Punk",
    file: "Daft Punk - Lose Yourself to Dance (Official Version).mp3"
  }
];

let currentTrack = 0;

// Load track
function loadTrack(index) {
  currentTrack = index;
  const track = playlist[currentTrack];

  audio.src = track.file;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;

  audio.play();
}

loadTrack(0); // Load first track on page load

// ===============================
// PLAYER BUTTONS
// ===============================

document.getElementById("play-btn").onclick = () => audio.play();
document.getElementById("pause-btn").onclick = () => audio.pause();

document.getElementById("stop-btn").onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

// Next track
document.getElementById("next-btn").onclick = () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
};

// Previous track
document.getElementById("prev-btn").onclick = () => {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
};

// Repeat toggle
let repeatEnabled = false;
document.getElementById("repeat-btn").onclick = () => {
  repeatEnabled = !repeatEnabled;
  audio.loop = repeatEnabled;
};

// Auto-advance when song ends
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
// RETRO 2000s WAVE VISUALIZER
// ===============================

// Grab the audio element you already have
const audioElement = document.getElementById("audio");

// Create the canvas AFTER you add it to HTML
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Resize canvas to match player width
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create AudioContext + Analyser
let audioCtx;
let analyser;
let source;

// Initialize visualizer when audio starts
function initVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();

        // Retro wave settings
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.85;

        source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
}

// Animation loop
function drawWave() {
    requestAnimationFrame(drawWave);

    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retro neon glow
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00eaff"; // cyan glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00eaff";

    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // normalize
        const y = (v * canvas.height) / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.quadraticCurveTo(x - sliceWidth, y, x, y); // smooth retro curve
        }

        x += sliceWidth;
    }

    ctx.stroke();
}

// Hook into your existing play button
audioElement.addEventListener("play", () => {
    initVisualizer();
    drawWave();
});

// Also resume AudioContext if paused
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