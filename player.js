/* ============================
   RETRO MEDIA PLAYER — FULL UPGRADE
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
    title: "Your Next Song",
    artist: "Artist Name",
    file: "song2.mp3"
  }
];

let currentTrack = 0;
let repeatMode = "none"; // none, one, all
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
   PLAYBACK CONTROLS
   ============================ */

playBtn.addEventListener("click", () => audio.play());
pauseBtn.addEventListener("click", () => audio.pause());

stopBtn.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
});

nextBtn.addEventListener("click", () => {
  if (shuffle) {
    currentTrack = Math.floor(Math.random() * playlist.length);
  } else {
    currentTrack = (currentTrack + 1) % playlist.length;
  }
  loadTrack(currentTrack);
  audio.play();
});

prevBtn.addEventListener("click", () => {
  currentTrack = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
  loadTrack(currentTrack);
  audio.play();
});

repeatBtn.addEventListener("click", () => {
  if (repeatMode === "none") repeatMode = "one";
  else if (repeatMode === "one") repeatMode = "all";
  else repeatMode = "none";

  repeatBtn.textContent = repeatMode === "one" ? "🔂" : repeatMode === "all" ? "🔁" : "🔁";
});

/* ============================
   AUTO NEXT TRACK
   ============================ */

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.play();
    return;
  }

  if (shuffle) {
    currentTrack = Math.floor(Math.random() * playlist.length);
  } else {
    currentTrack++;
  }

  if (currentTrack >= playlist.length) {
    if (repeatMode === "all") currentTrack = 0;
    else return;
  }

  loadTrack(currentTrack);
  audio.play();
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
   VISUALIZER SETUP
   ============================ */

const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

/* ============================
   VISUALIZER DRAW LOOP
   ============================ */

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const mode = visualizerMode.value;

  if (mode === "bars") drawBars();
  else if (mode === "wave") drawWave();
  else if (mode === "circle") drawCircle();
  else if (mode === "dots") drawDots();
}

function drawBars() {
  const barWidth = canvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = "#00aaff";
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
  }
}

function drawWave() {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00ff88";

  const slice = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const y = (dataArray[i] / 255) * canvas.height;
    ctx.lineTo(x, y);
    x += slice;
  }

  ctx.stroke();
}

function drawCircle() {
  const radius = Math.max(40, dataArray[10]);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#ff44aa";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawDots() {
  for (let i = 0; i < bufferLength; i++) {
    const size = dataArray[i] / 10;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    ctx.fillStyle = "#ffaa00";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

draw();

/* ============================
   INIT
   ============================ */

loadTrack(currentTrack);
