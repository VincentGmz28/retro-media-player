const audioPlayer = document.getElementById("audio-player");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Audio setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 512; // Higher resolution for smoother visuals

const source = audioCtx.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Color cycling
let hue = 200; // Start with WMP blue

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  // Background fade (liquid effect)
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  // Cycle colors slowly (Y2K neon)
  hue += 0.3;
  if (hue > 360) hue = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 1.2;

    // Neon gradient (Madonna Confessions Tour vibes)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `hsl(${hue}, 90%, 70%)`);
    gradient.addColorStop(1, `hsl(${hue + 40}, 90%, 40%)`);

    ctx.fillStyle = gradient;

    // Liquid bar shape (rounded top)
    ctx.beginPath();
    ctx.roundRect(
      x,
      canvas.height - barHeight,
      barWidth,
      barHeight,
      10
    );
    ctx.fill();

    // Glow pulse (WMP nostalgia)
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

    x += barWidth + 1;
  }
}

audioPlayer.onplay = () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  drawVisualizer();
};
