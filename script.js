// ------------------------------
// THEME SWITCHER
// ------------------------------
function setSkin(skinFile) {
    document.getElementById("skinStylesheet").href = skinFile;
}

// ------------------------------
// VISUALIZER MODE DROPDOWN
// ------------------------------
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

// ------------------------------
// PROFILE PIC UPLOAD
// ------------------------------
const profilePicBox = document.querySelector('.profile-pic');
const profilePicInput = document.getElementById('profilePicInput');

profilePicInput.addEventListener('change', () => {
    const file = profilePicInput.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    profilePicBox.style.backgroundImage = `url('${imgURL}')`;
    profilePicBox.style.backgroundSize = 'cover';
    profilePicBox.style.backgroundPosition = 'center';
});