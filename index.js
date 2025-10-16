const weightSlider = document.getElementById("weight");
const weightValue = document.getElementById("weightValue");
const styleSlider = document.getElementById("style");
const styleValue = document.getElementById("styleValue");
const addButton = document.querySelector(".add");
const startButton = document.querySelector(".start");
const multipleEggsBox = document.getElementById("multipleEggsBox");

const eggMenu = document.getElementById("eggMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const eggList = document.getElementById("eggList");

const namePopup = document.getElementById("namePopup");
const eggNameInput = document.getElementById("eggNameInput");
const cancelNameBtn = document.getElementById("cancelName");
const saveNameBtn = document.getElementById("saveName");

const timerView = document.getElementById("timerView");
const timerList = document.getElementById("timerList");
const pauseTimerBtn = document.getElementById("pauseTimer");
const stopTimerBtn = document.getElementById("stopTimer");

const nextEggName = document.getElementById("nextEggName");
const nextEggTime = document.getElementById("nextEggTime");

let eggs = [];
let timerInterval = null;
let timerRunning = false;


weightSlider.addEventListener("input", () => {
  const value = parseFloat(weightSlider.value).toFixed(1);
  weightValue.textContent = `${value}g`;
});

styleSlider.addEventListener("input", () => {
  const styleNumber = parseInt(styleSlider.value);
  let styleText = "";

  if (styleNumber === 1) styleText = "Softboiled";
  if (styleNumber === 2) styleText = "Mediumboiled";
  if (styleNumber === 3) styleText = "Hardboiled";

  styleValue.textContent = styleText;
});

function calculateBoilTime(weight, style) {
  let baseTime;
  if (style === "Softboiled") baseTime = 240;
  else if (style === "Mediumboiled") baseTime = 420;
  else if (style === "Hardboiled") baseTime = 600;
  else baseTime = 420;

  const standardWeight = 60;
  const adjustmentPerGram = 2;
  const weightDiff = weight - standardWeight;
  const adjustedTime = baseTime + weightDiff * adjustmentPerGram;

  return Math.max(0, adjustedTime);
}

addButton.addEventListener("click", () => {
  eggNameInput.value = "";
  namePopup.classList.add("active");
  eggNameInput.focus();
});

cancelNameBtn.addEventListener("click", () => {
  namePopup.classList.remove("active");
});

saveNameBtn.addEventListener("click", () => {
  const name = eggNameInput.value.trim() || "No name";
  const weight = parseFloat(weightSlider.value);
  const style = styleValue.textContent;
  const time = calculateBoilTime(weight, style) * 1000;

  eggs.push({ name, weight, style, time });

  multipleEggsBox.textContent = `+${eggs.length}`;
  namePopup.classList.remove("active");
  renderEggList();
});


multipleEggsBox.addEventListener("click", () => {
  if (eggs.length > 0) eggMenu.classList.add("active");
});

closeMenuBtn.addEventListener("click", () => {
  eggMenu.classList.remove("active");
});

function renderEggList() {
  eggList.innerHTML = "";
  eggs.forEach((egg, index) => {
    const div = document.createElement("div");
    div.classList.add("egg-item");

    const timeText = formatTime(egg.time);

    div.innerHTML = `
      <div class="egg-info">
        <span class="egg-number">#${index + 1}</span>
        <strong>${egg.name}</strong>
        <span>${egg.weight}g</span>
        <span>${egg.style}</span>
        <span>${timeText}</span>
      </div>
      <button class="trash-btn" data-index="${index}">🗑</button>
    `;
    eggList.appendChild(div);
  });

  document.querySelectorAll(".trash-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      eggs.splice(i, 1);
      multipleEggsBox.textContent = eggs.length > 0 ? `+${eggs.length}` : "+";
      renderEggList();
    });
  });
}

startButton.addEventListener("click", () => {
  if (eggs.length === 0) {
    alert("Du måste lägga till minst ett ägg först!");
    return;
  }

  document.getElementById("main").style.display = "none";
  timerView.style.display = "flex";

  const sortedEggs = [...eggs].sort((a, b) => a.time - b.time);
  timerRunning = true;

  updateTimerView(sortedEggs);
  timerInterval = setInterval(() => {
    if (!timerRunning) return;

    sortedEggs.forEach((egg) => {
      egg.time -= 100;
      if (egg.time < 0) egg.time = 0;
    });

    updateTimerView(sortedEggs);

    if (sortedEggs.every((e) => e.time === 0)) {
      clearInterval(timerInterval);
      alert("Alla ägg är färdiga! 🥚");
    }
  }, 100);
});

function updateTimerView(sortedEggs) {
  const next = sortedEggs.find((e) => e.time > 0);
  if (next) {
    nextEggName.textContent = next.name;
    nextEggTime.textContent = formatTime(next.time);
  } else {
    nextEggName.textContent = "–";
    nextEggTime.textContent = "00:00";
  }

  timerList.innerHTML = "";
  sortedEggs.forEach((egg) => {
    const item = document.createElement("div");
    item.classList.add("timer-item");
    item.innerHTML = `
      <strong>${egg.name}</strong>
      <span class="style-text">${egg.style}</span>
      <span class="time-text">${formatTime(egg.time)}</span>
    `;
    timerList.appendChild(item);
  });
}

pauseTimerBtn.addEventListener("click", () => {
  timerRunning = !timerRunning;
  pauseTimerBtn.textContent = timerRunning ? "⏸" : "▶";
});

stopTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  timerView.style.display = "none";
  document.getElementById("main").style.display = "block";
});

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}