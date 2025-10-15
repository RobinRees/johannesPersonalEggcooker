const weightSlider = document.getElementById("weight");
const weightValue = document.getElementById("weightValue");
const styleSlider = document.getElementById("style");
const styleValue = document.getElementById("styleValue");
const addButton = document.querySelector(".add");
const multipleEggsBox = document.getElementById("multipleEggsBox");

const namePopup = document.getElementById("namePopup");
const eggNameInput = document.getElementById("eggNameInput");
const cancelNameBtn = document.getElementById("cancelName");
const saveNameBtn = document.getElementById("saveName");

const eggMenu = document.getElementById("eggMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const eggList = document.getElementById("eggList");



weightSlider.addEventListener("input", () => {
  weightValue.textContent = `${weightSlider.value}g`;
});

styleSlider.addEventListener("input", () => {
  const styles = ["Softboiled", "Medium", "Hardboiled"];
  styleValue.textContent = styles[styleSlider.value - 1];
});




// === Data ===
let eggs = [];

// === Funktion för att uppdatera viktvärdet ===
weightSlider.addEventListener("input", () => {
  const value = parseFloat(weightSlider.value).toFixed(1);
  weightValue.textContent = `${value}g`;
});

// === Funktion för att uppdatera stil beroende på slider ===
styleSlider.addEventListener("input", () => {
  const styleNumber = parseInt(styleSlider.value);

  let styleText = "";
  if (styleNumber === 1) styleText = "Softboiled";
  if (styleNumber === 2) styleText = "Medium";
  if (styleNumber === 3) styleText = "Hardboiled";

  styleValue.textContent = styleText;
});

// === Funktion för att räkna ut koktid ===
function calculateBoilTime(weight, style) {
  let baseTime;

  if (style === "Softboiled") {
    baseTime = 240; // 
  } else if (style === "Medium") {
    baseTime = 420; // 
  } else if (style === "Hardboiled") {
    baseTime = 600; // 
  } else {
    baseTime = 420; 
  }

  const standardWeight = 60;
  const adjustmentPerGram = 2;
  const weightDiff = weight - standardWeight;
  const adjustedTime = baseTime + weightDiff * adjustmentPerGram;

  return Math.max(0, adjustedTime);
}

// === När man trycker på “+” ===
addButton.addEventListener("click", () => {
  eggNameInput.value = "";
  namePopup.classList.add("active");
  eggNameInput.focus();
});

cancelNameBtn.addEventListener("click", () => {
  namePopup.classList.remove("active");
});

// Spara ägg med namn
saveNameBtn.addEventListener("click", () => {
  const name = eggNameInput.value.trim() || "No name";
  const currentWeight = parseFloat(weightSlider.value);
  const currentStyle = styleValue.textContent;
  const time = calculateBoilTime(currentWeight, currentStyle);

  // Skapa ägg-objekt
  eggs.push({
    name: name,
    weight: currentWeight,
    style: currentStyle,
    time: time
  });

  // Uppdatera cirkel
  multipleEggsBox.textContent = `+${eggs.length}`;

  // Uppdatera lista i menyn
  renderEggList();

  namePopup.classList.remove("active");
  eggMenu.classList.add("active");
});

// Enter = spara
eggNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveNameBtn.click();
});

// Stäng meny
closeMenuBtn.addEventListener("click", () => {
  eggMenu.classList.remove("active");
});

// Funktion för att rita ut ägglistan
function renderEggList() {
  eggList.innerHTML = ""; // rensa först
  eggs.forEach((egg, index) => {
    const div = document.createElement("div");
    div.classList.add("egg-item");
    div.innerHTML = `
      <div class="egg-info">
        <span class="egg-number">#${index + 1}</span>
        <strong>${egg.name}</strong>
        <span>${egg.weight}g</span>
        <span>${egg.style}</span>
      </div>
      <button class="trash-btn" data-index="${index}">🗑</button>
    `;
    eggList.appendChild(div);
  });

  // Lägg till ta bort-knappar
  document.querySelectorAll(".trash-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      eggs.splice(i, 1);
      multipleEggsBox.textContent = eggs.length > 0 ? `+${eggs.length}` : "+";
      renderEggList();
    });
  });
}