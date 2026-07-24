const audio = document.getElementById("audio-player");

document.getElementById("play-btn").onclick = () => audio.play();
document.getElementById("pause-btn").onclick = () => audio.pause();
document.getElementById("stop-btn").onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

document.getElementById("next-btn").onclick = () => {
  // placeholder for playlist logic
};

document.getElementById("prev-btn").onclick = () => {
  // placeholder for playlist logic
};

let repeatEnabled = false;
document.getElementById("repeat-btn").onclick = () => {
  repeatEnabled = !repeatEnabled;
  audio.loop = repeatEnabled;
};
