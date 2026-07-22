// -----------------------------
// VISUALIZER SETUP
// -----------------------------

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let animationId;

// Canvas
const canvas = document.getElementById("visualizerCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas for crisp rendering
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// -----------------------------
// START VISUALIZER (called from Play button)
// -----------------------------
function startVisualizer() {
    // Create audio context ONLY after user gesture (Safari requirement)
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Connect audio element to analyser
    const source = audioContext.createMediaElementSource(audioPlayer);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    drawVisualizer();
}

// -----------------------------
// STOP VISUALIZER
// -----------------------------
function stopVisualizer() {
    cancelAnimationFrame(animationId);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// -----------------------------
// DRAW LOOP
// -----------------------------
function drawVisualizer() {
    animationId = requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];

        // Neon retro color
        const r = barHeight + 25;
        const g = 50;
        const b = 200;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}
