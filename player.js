/* ============================
   RETRO MEDIA PLAYER 
   ============================ */

const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const repeatBtn = document.getElementById("repeat-btn");

const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");

const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const trackTitleEl = document.getElementById("track-title");
const trackArtistEl = document.getElementById("track-artist");

const visualizerMode = document.getElementById("visualizer-mode");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 200;

/* ============================
   PLAYLIST SYSTEM
   ============================ */

const playlist = [
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
let repeatMode = "none";
let shuffle = false;

/* ============================
   LOAD TRACK
   ============================ */

function loadTrack(index) {
  const track = playlist[index];
  audio.src = track.file;

  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;

  audio.load();
}

/* ============================
   AUDIO + VISUALIZER SETUP
   ============================ */

const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

let visualizerReady = false;

function initVisualizer() {
  if (visualizerReady) return;
  visualizerReady = true;

  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
}

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

/* ============================
   PLAYBACK CONTROLS
   ============================ */

function startAudio() {
  if (audioCtx.state === "suspended") audioCtx.resume();
  initVisualizer();
  audio.play();
}

playBtn.addEventListener("click", startAudio);
pauseBtn.addEventListener("click", () => audio.pause());

stopBtn.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
});

nextBtn.addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  startAudio();
});

prevBtn.addEventListener("click", () => {
  currentTrack = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
  loadTrack(currentTrack);
  startAudio();
});

/* ============================
   REPEAT MODE
   ============================ */

repeatBtn.addEventListener("click", () => {
  if (repeatMode === "none") repeatMode = "one";
  else if (repeatMode === "one") repeatMode = "all";
  else repeatMode = "none";

  repeatBtn.textContent =
    repeatMode === "one" ? "🔂" :
    repeatMode === "all" ? "🔁" :
    "🔁";
});

/* ============================
   AUTO NEXT TRACK
   ============================ */

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    startAudio();
    return;
  }

  currentTrack++;

  if (currentTrack >= playlist.length) {
    if (repeatMode === "all") currentTrack = 0;
    else return;
  }

  loadTrack(currentTrack);
  startAudio();
});

/* ============================
   SEEK BAR
   ============================ */

audio.addEventListener("timeupdate", () => {
  seekBar.value = (audio.currentTime / audio.duration) * 100;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

seekBar.addEventListener("input", () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

/* ============================
   VOLUME CONTROL
   ============================ */

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

/* ============================
   TIME FORMATTER
   ============================ */

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ============================
   2006 COLOR SHIFT ENGINE
   ============================ */

let hue = 0;

function get2006Color(alpha =1) {
   hue = (hue + 0.5) % 360; 
   return 'hsla(${hue}, 80%, 60%, ${alpha})';
}

/* ============================
   VISUALIZER DRAW LOOP
   ============================ */

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);
   
const mode = visualizerMode.value;

  if (mode === "bars") {
    ctx.fillStyle = "#0A0A0A"; // dark grey
  } else if (mode === "wave") {
    ctx.fillStyle = "#001122"; // deep blue
  } else if (mode === "circle") {
    ctx.fillStyle = "#000000"; // black (starfield)
  } else if (mode === "dots") {
    ctx.fillStyle = "#120012"; // purple tint
  }

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (mode === "bars") drawBars();
  else if (mode === "wave") drawWave();
  else if (mode === "circle") drawCircle();
  else if (mode === "dots") drawEnergyBliss();
}

/* ============================
   MODE: BARS
   ============================ */

function drawBars() {
  const barWidth = canvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = "get2006Color";
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
  }
}

/* ============================
   MODE: WAVE
   ============================ */

function drawWave() {
  if (audio.paused) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = get2006Color();

    const mid = canvas.height / 2;
    const slice = canvas.width / (bufferLength - 1);
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const normalized = dataArray[i] / 255;
      const y = mid + normalized * 40;
      ctx.lineTo(x, y);
      x += slice;
    }

    ctx.stroke();
    return;
  }

  // Normal animated wave
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = get2006Color();

  const mid = canvas.height / 2;
  const slice = canvas.width / (bufferLength - 1);
  let x = 0;

  // Bass detection
  let bass = 0;
  for (let i = 0; i < bufferLength / 4; i++) {
    bass += dataArray[i];
  }
  bass = bass / (bufferLength / 4);
  const bassBoost = bass * 0.4;

  for (let i = 0; i < bufferLength; i++) {
    const normalized = dataArray[i] / 255;
    const waveHeight = Math.sin(i * 0.15 + audio.currentTime * 4) * 20;
    const y = mid + waveHeight + normalized * bassBoost;

    ctx.lineTo(x, y);
    x += slice;
  }

  ctx.stroke();
}

/* ============================
   MODE: STARFIELD (WMP Style)
   ============================ */

let stars = [];
const STAR_COUNT = 120;

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.5,
      size: Math.random() * 2 + 1
    });
  }
}

initStars();

function drawCircle() {
  if (audio.paused) return;

  let bass = 0;
  for (let i = 0; i < bufferLength / 4; i++) bass += dataArray[i];
  bass = bass / (bufferLength / 4);
  const bassBoost = bass * 0.02; // star speed boost

  ctx.fillStyle = "get2006Color";

  for (let star of stars) {

    star.x += Math.cos(star.angle) * (star.speed * 0.3 + bassBoost * 0.4);
    star.y += Math.sin(star.angle) * (star.speed * 0.3 + bassBoost * 0.4);

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    if (
      star.x < 0 || star.x > canvas.width ||
      star.y < 0 || star.y > canvas.height
    ) {
      star.x = canvas.width / 2;
      star.y = canvas.height / 2;
      star.angle = Math.random() * Math.PI * 2;
      star.speed = Math.random() * 0.5 + 0.5;
      star.size = Math.random() * 2 + 1;
    }
  }
}

/* ============================
   MODE: ENERGY BLISS
   ============================ */

function drawEnergyBliss() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < bufferLength; i++) {
    const radius = dataArray[i] * 0.4;
    const angle = (i / bufferLength) * Math.PI * 2;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.fillStyle = "get2006Color(0.7)";
    ctx.globalAlpha = 0.7;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
}

draw();

/* ============================
   INIT
   ============================ */

loadTrack(currentTrack);
