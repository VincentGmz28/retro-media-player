// Theme switching
function setSkin(skinFile) {
    document.getElementById("skinStylesheet").href = skinFile;
}

// Visualizer mode switching
const visualizerModeSelect = document.getElementById("visualizer-mode");
const visualizerModes = ["Bars", "Wave", "Circle", "Dots"];

visualizerModes.forEach(mode => {
    const option = document.createElement("option");
    option.value = mode;
    option.textContent = mode;
    visualizerModeSelect.appendChild(option);
});

visualizerModeSelect.addEventListener("change", () => {
    console.log("Visualizer mode changed to:", visualizerModeSelect.value);
});
