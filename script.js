const skinStylesheet = document.getElementById("skinStylesheet");

function setSkin(file) {
  if (!skinStylesheet) return;
  skinStylesheet.href = `${file}?v=${Date.now()}`;
  saveTheme(file);
}

function saveTheme(themeFile) {
  localStorage.setItem("retroTheme", themeFile);
}

function loadSavedTheme() {
  const saved = localStorage.getItem("retroTheme");
  if (saved) {
    skinStylesheet.href = `${saved}?v=${Date.now()}`;
  }
}

loadSavedTheme();
