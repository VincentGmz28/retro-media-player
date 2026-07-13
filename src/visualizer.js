const canvas = document.getElementById("vizCanvas");
const ctx = canvas.getContext("2d");

let vizMode = "retro"; // retro or tron

// Called from sidebar buttons
function setVisualizerMode(mode) {
  vizMode = mode;
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let t = 0;

function drawRetroBars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bars = 40;
  const barWidth = canvas.width / bars;

  for (let i = 0; i < bars; i++) {
    const height =
      (Math.sin(t + i * 0.3) * 0.5 + 0.5) * (canvas.height * 0.7);

    ctx.fillStyle = "#4fd1ff";
    ctx.shadowBlur = 0;

    ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
  }
}

function drawTronBars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bars = 50;
  const barWidth = canvas.width / bars;

  for (let i = 0; i < bars; i++) {
    const height =
      (Math.sin(t + i * 0.25) * 0.5 + 0.5) * (canvas.height * 0.8);

    ctx.fillStyle = "#00eaff";
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 20;

    ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
  }
}

function animate() {
  if (vizMode === "tron") {
    drawTronBars();
  } else {
    drawRetroBars();
  }

  t += 0.05;
  requestAnimationFrame(animate);
}

animate();