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

document.getElementById("play-btn").onclick = () => audio.play();
document.getElementById("pause-btn").onclick = () => audio.pause();
document.getElementById("stop-btn").onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

let repeatEnabled = false;
document.getElementById("repeat-btn").onclick = () => {
  repeatEnabled = !repeatEnabled;
  audio.loop = repeatEnabled;
};
