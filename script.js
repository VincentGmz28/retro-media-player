// Get elements
const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const fileInput = document.getElementById("fileInput");
const volumeSlider = document.getElementById("volumeSlider");

// -----------------------------
// FILE UPLOAD (iPhone‑safe)
// -----------------------------
fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    audioPlayer.src = url;

    // Required for Safari/iPhone
    audioPlayer.load();
});

// -----------------------------
// PLAY BUTTON (Safari unlocks audio ONLY after user gesture)
// -----------------------------
playBtn.addEventListener("click", () => {
    audioPlayer.play();

    // Start visualizer ONLY after user gesture
    if (typeof startVisualizer === "function") {
        startVisualizer();
    }
});

// -----------------------------
// PAUSE BUTTON
// -----------------------------
pauseBtn.addEventListener("click", () => {
    audioPlayer.pause();
});

// -----------------------------
// STOP BUTTON (also stops visualizer)
// -----------------------------
stopBtn.addEventListener("click", () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    if (typeof stopVisualizer === "function") {
        stopVisualizer();
    }
});

// -----------------------------
// VOLUME SLIDER (Safari requires "input" event)
// -----------------------------
volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
});