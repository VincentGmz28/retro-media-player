import { setVisualizerMode } from "./visualizer.js";

// UNIVERSAL VISUALIZER MODES
const allModes = [
  "liquidBars",
  "oceanWaves",
  "barsAndWaves",
  "tronGrid",
  "barbieSparkle",
  "discoGrid"
];

let modeIndex = 0;

// Cycle modes every 8 seconds
setInterval(() => {
  modeIndex = (modeIndex + 1) % allModes.length;
  setVisualizerMode(allModes[modeIndex]);
}, 8000);

// AUDIO CONTROLS
const audio = document.getElementById("audio-player");

document.getElementById("play-btn").onclick = () => {
  audioCtx.resume();   // REQUIRED
  audio.play();
};

document.getElementById("pause-btn").onclick = () => audio.pause();
document.getElementById("stop-btn").onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

// SEEK BAR
const seekBar = document.getElementById("seek-bar");
audio.addEventListener("timeupdate", () => {
  seekBar.value = (audio.currentTime / audio.duration) * 100;
});
seekBar.addEventListener("input", () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// VOLUME
const volumeBar = document.getElementById("volume-bar");
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});
