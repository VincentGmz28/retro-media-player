import { setVisualizerMode } from "./visualizer.js";

// ------------------------------
// VISUALIZER MODE CONTROL
// ------------------------------
let currentTheme = "classic";
let modeIndex = 0;
let modeCycleInterval = null;

// Theme → Visualizer Modes
const themeModes = {
  classic: ["liquidBars", "oceanWaves", "barsAndWaves"],
  tron: ["tronGrid", "liquidBars", "barsAndWaves"],
  barbie: ["barbieSparkle", "discoGrid", "liquidBars"]
};

// Auto-cycle visualizer modes
function startModeCycle() {
  clearInterval(modeCycleInterval);

  modeCycleInterval = setInterval(() => {
    const modes = themeModes[currentTheme];
    modeIndex = (modeIndex + 1) % modes.length;
    setVisualizerMode(modes[modeIndex]);
  }, 8000); // 8 seconds per mode
}

// ------------------------------
// THEME SWITCHER (UPDATED)
// ------------------------------
function setSkin(file) {
  document.getElementById("skinStylesheet").href = file + "?v=" + Date.now();

  if (file.includes("style.css")) currentTheme = "classic";
  if (file.includes("style-tron.css")) currentTheme = "tron";
  if (file.includes("style-barbie.css")) currentTheme = "barbie";

  modeIndex = 0;
  setVisualizerMode(themeModes[currentTheme][0]);
  startModeCycle();
}

window.setSkin = setSkin;

// ------------------------------
// AUDIO CONTROLS
// ------------------------------
const audio = document.getElementById("audio-player");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

// Play
document.getElementById("play-btn").onclick = () => audio.play();

// Pause
document.getElementById("pause-btn").onclick = () => audio.pause();

// Stop
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

// Seek bar update
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  seekBar.value = progress;

  currentTimeDisplay.textContent = formatTime(audio.currentTime);
  durationDisplay.textContent = formatTime(audio.duration);
});

// Seek bar control
seekBar.addEventListener("input", () => {
  const newTime = (seekBar.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

// Volume control
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

// Time formatting
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
