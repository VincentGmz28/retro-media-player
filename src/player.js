const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");

// Placeholder track — replace with your own MP3 later
const tracks = [
  {
    name: "Sample Track",
    file: "music/sample1.mp3"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Load a track into the audio element
function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.file;
}

// Play / Pause toggle
function togglePlayPause() {
  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶";
  }
}

playPauseBtn.addEventListener("click", togglePlayPause);

// Update seek bar as the song plays
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

// Seek bar control
seekBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

// Volume control
volumeBar.addEventListener