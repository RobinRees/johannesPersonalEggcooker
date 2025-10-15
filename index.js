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

let eggs = [];

weightSlider.addEventListener("input", () => {
  const value = parseFloat(weightSlider.value).toFixed(1);
  weightValue.textContent = `${value}g`;
});

styleSlider.addEventListener("input", () => {
  const styleNumber = parseInt(styleSlider.value);
  let styleText = "";

  if (styleNumber === 1) {
    styleText = "softboiled";
  }
  if (styleNumber === 2) {
    styleText = "Medium";
  }
  if (styleNumber === 3) {
    styleText = "Hardboiled";
  }

  styleValue.textContent = styleText;
});

function calculateBoilTime(weight, style) {
  let baseTime;
  if (style === "softboiled") {
    baseTime = 240;
  } else if (style === "Medium") {
    baseTime = 420;
  } else if (style === "Hardboiled") {
    baseTime = 600;
  } else {
    baseTime = 420;
  }

  const standardWeight = 60;
  const adjustmentPerGram = 2;
  const weightDiff = weight - standardWeight;
  const adjustedTime = baseTime + weightDiff * adjustmentPerGram;

  return Math.max(0, adjustedTime);
}

addButton.addEventListener("click", () => {
  eggNameInput.value = "";
  namePopup.classList.add("active");
  eggNameInput.focus(); // vad är focus?
});

multipleEggsBox.addEventListener("click", () => {
  if (eggs.length > 0) {
    eggMenu.classList.add("active");
  }
});

cancelNameBtn.addEventListener("click", () => {
  namePopup.classList.remove("active");
});

saveNameBtn.addEventListener("click", () => {
  const name = eggNameInput.value.trim() || "no name";
  const weight = parseFloat(weightSlider.value);
  const style = styleValue.textContent;
  const time = calculateBoilTime(weight, style);

  eggs.push({ name, weight, style, time });

  multipleEggsBox.textContent = `+${eggs.length}`;
  namePopup.classList.remove("active");
  renderEggList();
});

closeMenuBtn.addEventListener("click", () => {
  eggMenu.classList.remove("active");
});

function renderEggList() {
  eggList.innerHTML = "";
  eggs.forEach((egg, index) => {
    const div = document.createElement("div");
    div.classList.add("egg-item");

    const minutes = Math.floor(egg.time / 60);
    const seconds = Math.floor(egg.time % 60)
      .toString()
      .padStart(2, "0");
    const timeText = `${minutes}:${seconds}`;

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


const timerView = document.getElementById("timerView");
const startBtn = document.querySelector(".start");

startBtn.addEventListener("click", () => {
  document.getElementById("main").style.display = "none";
  timerView.style.display = "block";
});