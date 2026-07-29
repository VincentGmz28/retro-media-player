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
  },
  {
    title: "No Plan",
    artist: "Hozier",
    file: "Hozier - No Plan (Audio).mp3"
  },
  {
    title: "Anyone",
    artist: "Demi Lovato",
    file: "Demi Lovato - Anyone (Official Lyric Video).mp3"
  }  
];

let currentTrack = 0;
let repeatMode = "none";

function loadTrack(index) {
  const track = playlist[index];
  audio.src = track.file;
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  audio.load();
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();

let visualizerReady = false;

function initVisualizer() {
  if (visualizerReady) return;
  visualizerReady = true;

  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
}

window.addEventListener("click", () => {
  if (audioCtx.state === "suspended") audioCtx.resume();
});

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function startAudio() {
  audioCtx.resume();
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

repeatBtn.addEventListener("click", () => {
  repeatMode =
    repeatMode === "none" ? "one" :
    repeatMode === "one" ? "all" :
    "none";

  repeatBtn.textContent =
    repeatMode === "one" ? "🔂" :
    repeatMode === "all" ? "🔁" :
    "🔁";
});

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

audio.addEventListener("timeupdate", () => {
  if (!audio.duration || isNaN(audio.duration)) return;

  seekBar.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

seekBar.addEventListener("input", () => {
  if (!audio.duration || isNaN(audio.duration)) return;
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

let hue = 0;
function get2006Color(alpha = 1) {
  hue = (hue + 0.5) % 360;
  return `hsla(${hue}, 80%, 60%, ${alpha})`;
}

let stars = [];
const STAR_COUNT = 120;

function initStars() {
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.5 + 0.5,
    size: Math.random() * 2 + 1
  }));
}

initStars();

let bgHue = 0;
let orbAngle = 0;
let stripeOffset = 0;

function bgBars() {
  stripeOffset += 1;
  ctx.fillStyle = "#0E2233";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = -50; i < canvas.width; i += 50) {
    ctx.fillRect(i + stripeOffset, 0, 25, canvas.height);
  }
}

function bgWave() {
  bgHue = (bgHue + 0.2) % 360;
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, `hsla(${bgHue}, 70%, 15%, 1)`);
  g.addColorStop(1, `hsla(${(bgHue + 60) % 360}, 70%, 10%, 1)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function bgCircle() {
  orbAngle += 0.01;
  const g = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    20,
    canvas.width / 2,
    canvas.height / 2,
    300
  );
  g.addColorStop(0, `hsla(${orbAngle * 50}, 80%, 60%, 0.8)`);
  g.addColorStop(1, "hsla(0, 0%, 0%, 0.2)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function bgDots() {
  orbAngle += 0.01;
  const g = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    10,
    canvas.width / 2,
    canvas.height / 2,
    250
  );
  g.addColorStop(0, `hsla(${orbAngle * 40}, 90%, 95%, 1)`);
  g.addColorStop(1, "hsla(0, 0%, 100%, 0.6)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  const mode = visualizerMode.value;

  if (mode === "bars") bgBars();
  else if (mode === "wave") bgWave();
  else if (mode === "circle") bgCircle();
  else if (mode === "dots") bgDots();

  if (mode === "bars") drawBars();
  else if (mode === "wave") drawWave();
  else if (mode === "circle") drawCircle();
  else if (mode === "dots") drawEnergyBliss();
}

function drawBars() {
  let bass = 0;
  for (let i = 0; i < bufferLength / 4; i++) bass += dataArray[i];
  bass = bass / (bufferLength / 4);
  const bassScale = 0.8 + bass * 0.003;

  const barWidth = (canvas.width / bufferLength) * 2;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i];
    const barHeight = v * bassScale * 0.5;
    ctx.fillStyle = "hsl(200, 90%, 60%)";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }
}

function drawWave() {
  if (audio.paused) return;

  analyser.getByteFrequencyData(dataArray);
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = get2006Color(0.8);

  const slice = (canvas.width / bufferLength) * 3;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = (dataArray[i] / 255) * 1.25;
    const y = canvas.height / 2 + (v - 0.5) * 60;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += slice;
  }

  ctx.stroke();
}

function drawCircle() {
  let bass = 0;
  for (let i = 0; i < bufferLength / 4; i++) bass += dataArray[i];
  bass = bass / (bufferLength / 4);
  const bassBoost = bass * 0.015;

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.shadowColor = "white";
  ctx.shadowBlur = 8;

  if (audio.paused) {
    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  for (const star of stars) {
    const movement = star.speed * 0.2 + bassBoost;
    star.x += Math.cos(star.angle) * movement;
    star.y += Math.sin(star.angle) * movement;

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
      star.speed = Math.random() * 0.3 + 0.3;
      star.size = Math.random() * 2 + 1;
    }
  }
}

function drawEnergyBliss() {
  analyser.getByteFrequencyData(dataArray);

  let bass = 0;
  for (let i = 0; i < bufferLength / 4; i++) bass += dataArray[i];
  bass = bass / (bufferLength / 4);
  const bassRadiusBoost = bass * 0.03;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.globalAlpha = 0.8;

  for (let i = 0; i < bufferLength; i++) {
    const baseRadius = dataArray[i] * 0.35;
    const radius = baseRadius + bassRadiusBoost;
    const angle = (i / bufferLength) * Math.PI * 2;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.fillStyle = "#ff8ac6";

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
}

draw();
loadTrack(currentTrack);
