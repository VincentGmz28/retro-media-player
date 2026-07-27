function setSkin(skinFile) {
    document.getElementById("skinStylesheet").href = skinFile;
}

const visualizerModeSelect = document.getElementById("visualizer-mode");
const visualizerModes = ["bars", "wave", "circle", "dots"];

visualizerModes.forEach(mode => {
    const option = document.createElement("option");
    option.value = mode;
    option.textContent = mode;
    visualizerModeSelect.appendChild(option);
});

visualizerModeSelect.addEventListener("change", () => {
    console.log("Visualizer mode changed to:", visualizerModeSelect.value);
});