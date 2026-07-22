// ===============================
// SELECT ELEMENTS
// ===============================

const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume-slider");
const fileInput = document.getElementById("file-input");
const themeToggle = document.getElementById("theme-toggle");

// ===============================
// PLAY BUTTON
// ===============================

playBtn.addEventListener("click", () => {
    audio.play();
});

// ===============================
// PAUSE BUTTON
// ===============================

pauseBtn.addEventListener("click", () => {
    audio.pause();
});

// ===============================
// STOP BUTTON
// ===============================

stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    progressBar.value = 0;
});

// ===============================
// UPDATE PROGRESS BAR AS AUDIO PLAYS
// ===============================

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
    }
});

// ===============================
// SEEKING (USER DRAGS PROGRESS BAR)
// ===============================

progressBar.addEventListener("input", () => {
    if (audio.duration) {
        const newTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = newTime;
    }
});

// ===============================
// VOLUME CONTROL
// ===============================

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

// ===============================
// FILE LOADER (LOAD LOCAL MP3/WAV)
// ===============================

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audio.src = fileURL;
        audio.play();
    }
});

// ===============================
// THEME SWITCHER
// ===============================

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});