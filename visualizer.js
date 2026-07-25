import { setVisualizerMode } from "./visualizer.js";

// ===============================
// UNIVERSAL VISUALIZER MODES
// ===============================

const allModes = [
  "liquidBars",
  "oceanWaves",
  "barsAndWaves",
  "tronGrid",
  "barbieSparkle",
  "discoGrid"
];

let modeIndex = 0;
let modeCycleInterval = null;

// Auto-cycle visualizer modes
function startModeCycle() {
  clearInterval(modeCycleInterval);

  modeCycleInterval = setInterval(() => {
    modeIndex = (modeIndex + 1) % allModes.length;
    setVisualizerMode(allModes[modeIndex]);
  }, 8000); // 8 seconds per mode
}

// ===============================
// THEME SWITCHER (SKINS ONLY)
// ===============================

function setSkin(file) {
  document.getElementById("skinStylesheet").href = file + "?v=" + Date.now();
}

window.setSkin = setSkin;

// ===============================
// AUDIO CONTROLS
// ===============================

const audio = document.getElementById("audio-player");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

// ⭐ REQUIRED for visualizer to work
document.getElementById("play-btn").onclick = () => {
  if (typeof audioCtx !== "undefined") {
    audioCtx.resume();
  }
  audio.play();
};

document.getElementById("pause-btn").onclick = () => audio.pause();

document.getElementById("stop-btn").onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

// Repeat
let repeatEnabled = false;
document.getElementById("repeat-btn").onclick = () => {
  repeatEnabled = !repeatEnabled;
  audio.loop = repeatEnabled;
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

// Start cycling modes immediately
setVisualizerMode(allModes[0]);
startModeCycle();
