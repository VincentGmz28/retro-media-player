const themeStylesheet = document.getElementById("themeStylesheet");

function setTheme(theme) {
  if (theme === "tron") {
    themeStylesheet.href = "style-tron.css";
  } else {
    themeStylesheet.href = "style.css";
  }
}
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const playlistList = document.getElementById("playlistList");

// Add your MP3s here
const tracks = [
  { name: "Sample Track", file: "music/sample1.mp3" },
  // Add more tracks like:
  // { name: "My Song 2", file: "music/song2.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Load track into audio element
function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.file;

  // Update playlist highlight
  updatePlaylistHighlight();

  // Auto-play when switching tracks
  if (isPlaying) {
    audio.play();
  }
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

// Next track
function nextTrack() {
  currentTrackIndex++;
  if (currentTrackIndex >= tracks.length) {
    currentTrackIndex = 0; // loop back to first track
  }
  loadTrack(currentTrackIndex);
}

nextBtn.addEventListener("click", nextTrack);

// Previous track
function prevTrack() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = tracks.length - 1; // go to last track
  }
  loadTrack(currentTrackIndex);
}

prevBtn.addEventListener("click", prevTrack);

// Auto-play next track when current ends
audio.addEventListener("ended", nextTrack);

// Seek bar updates
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
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

// Build playlist UI
function buildPlaylist() {
  playlistList.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.addEventListener("click", () => {
      currentTrackIndex = index;
      loadTrack(index);
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = "⏸";
    });
    playlistList.appendChild(li);
  });
}

// Highlight current track
function updatePlaylistHighlight() {
  const items = playlistList.querySelectorAll("li");
  items.forEach((item, index) => {
    item.style.color = index === currentTrackIndex ? "#4fd1ff" : "#ffffff";
  });
}

// Initialize
build