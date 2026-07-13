const canvas = document.getElementById("vizCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to match CSS size
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Simple animated bar visualizer (placeholder)
let t = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bars = 40;
  const barWidth = canvas.width / bars;

  for (let i = 0; i < bars; i++) {
    const height =
      (Math.sin(t + i * 0.3) * 0.5 + 0.5) * (canvas.height * 0.7);

    ctx.fillStyle = "#4fd1ff";
    ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
  }

  t += 0.05;
  requestAnimationFrame(draw);
}