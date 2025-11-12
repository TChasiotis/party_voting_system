// vote.js — Drag & Drop voting page with multiple voters

const STORAGE_KEY = "shrek_candidates";
let candidates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let numVoters = parseInt(localStorage.getItem("num_voters"), 10) || 1;

// Session tracking
const SESSION_ROUND = "shrek_round";
let currentRound = parseInt(sessionStorage.getItem(SESSION_ROUND), 10);
if (Number.isNaN(currentRound)) currentRound = 1;

const numPositions = 10;
const positionsContainer = document.getElementById("vote-positions");
const thumbsContainer = document.getElementById("candidates-thumbs");
const submitBtn = document.getElementById("submit-vote");

let positions = Array(numPositions).fill(null);

function renderPositions() {
  positionsContainer.innerHTML = "";
  for (let i = 0; i < numPositions; i++) {
    const slot = document.createElement("div");
    slot.className = "vote-slot";
    slot.dataset.idx = i;
    if (positions[i]) {
      slot.textContent = positions[i].playerName;
      slot.classList.add("occupied");
    } else {
      slot.textContent = `Θέση ${i + 1}`;
      slot.classList.remove("occupied");
    }
    positionsContainer.appendChild(slot);
  }
  addSlotDragDrop();
  checkSubmitBtn();
}

function renderThumbs() {
  thumbsContainer.innerHTML = "";
  candidates.forEach((c, index) => {
    const thumb = document.createElement("div");
    thumb.className = "candidate-thumb";
    thumb.draggable = true;
    thumb.dataset.idx = index;

    const img = document.createElement("img");
    img.src = c.playerPhoto || c.characterPhoto || "";
    img.alt = c.playerName;

    const name = document.createElement("div");
    name.textContent = c.playerName;

    thumb.appendChild(img);
    thumb.appendChild(name);
    thumbsContainer.appendChild(thumb);
  });
  addThumbDrag();
}

// Drag from thumbs
function addThumbDrag() {
  const thumbs = document.querySelectorAll(".candidate-thumb");
  thumbs.forEach(thumb => {
    thumb.addEventListener("dragstart", e => {
      e.dataTransfer.setData("thumbIdx", thumb.dataset.idx);
    });
  });
}

// Drag & drop on slots
function addSlotDragDrop() {
  const slots = document.querySelectorAll(".vote-slot");
  slots.forEach(slot => {
    slot.addEventListener("dragover", e => e.preventDefault());
    slot.addEventListener("drop", e => {
      e.preventDefault();
      const thumbIdx = parseInt(e.dataTransfer.getData("thumbIdx"));
      const candidate = candidates[thumbIdx];
      const slotIdx = parseInt(slot.dataset.idx);

      // Remove candidate from previous slot
      const prevSlotIdx = positions.findIndex(p => p === candidate);
      if (prevSlotIdx !== -1) positions[prevSlotIdx] = null;

      // If slot occupied, move old candidate back to thumbs (nothing extra needed)
      positions[slotIdx] = candidate;

      renderPositions();
    });
  });
}

function checkSubmitBtn() {
  const allFilled = positions.every(p => p !== null);
  submitBtn.style.display = allFilled ? "block" : "none";
}

// Submit vote
submitBtn.addEventListener("click", () => {
  // === Δημιουργία καθαρής λίστας ψήφων με βάση τα ονόματα ===
  const votes = positions.map(c => c ? (c.id || c.playerName || c.characterName) : null);
  localStorage.setItem("last_vote", JSON.stringify(votes));

  // === Φόρτωση προηγούμενων πόντων ===
  let scores = JSON.parse(localStorage.getItem("shrek_scores")) || {};

  // === Manual προσθήκη πόντων ανά θέση ===
  votes.forEach((id, index) => {
    if (!id) return;
    let pointsToAdd = 0;

    // Πόντοι ανά θέση (1η = 10, 2η = 9, ... 10η = 1)
    if (index === 0) pointsToAdd = 10;
    else if (index === 1) pointsToAdd = 9;
    else if (index === 2) pointsToAdd = 8;
    else if (index === 3) pointsToAdd = 7;
    else if (index === 4) pointsToAdd = 6;
    else if (index === 5) pointsToAdd = 5;
    else if (index === 6) pointsToAdd = 4;
    else if (index === 7) pointsToAdd = 3;
    else if (index === 8) pointsToAdd = 2;
    else if (index === 9) pointsToAdd = 1;

    // Προσθήκη στο συνολικό σκορ
    scores[id] = (scores[id] || 0) + pointsToAdd;
  });

  // === Αποθήκευση πίσω στο localStorage ===
  localStorage.setItem("shrek_scores", JSON.stringify(scores));

  // === Ενημέρωση των ίδιων των υποψηφίων στο STORAGE_KEY ===
  let storedCandidates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  storedCandidates.forEach(c => {
    const id = c.id || c.playerName || c.characterName;
    c.points = scores[id] || 0;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCandidates));

  // === Debugging ===
  console.log("Votes:", votes);
  console.log("Scores:", scores);

  // === Αύξηση γύρου ===
  currentRound++;
  sessionStorage.setItem(SESSION_ROUND, currentRound);

  if (currentRound > numVoters) {
    window.location.href = "results.html";
  } else {
    positions = Array(numPositions).fill(null);
    if (typeof renderPositions === "function") renderPositions();
    window.location.href = "index.html";
  }
});


/*// Submit vote
submitBtn.addEventListener("click", () => {
  // === Δημιουργία καθαρής λίστας ψήφων με βάση τα ονόματα ===
  const votes = positions.map(c => c ? (c.id || c.playerName || c.characterName) : null);
  localStorage.setItem("last_vote", JSON.stringify(votes));

  // === Φόρτωση προηγούμενων πόντων ===
  let scores = JSON.parse(localStorage.getItem("shrek_scores")) || {};
  const maxPoints = numPositions; // π.χ. 10 θέσεις -> 10 πόντοι στην 1η θέση

  // === Προσθήκη πόντων με βάση τη σειρά ===
  votes.forEach((id, i) => {
    if (!id) return;
    const pointsToAdd = maxPoints - i; // 1η θέση -> 10 πόντοι
    scores[id] = (scores[id] || 0) + pointsToAdd;
  });

  // === Αποθήκευση πίσω στο localStorage ===
  localStorage.setItem("shrek_scores", JSON.stringify(scores));

  // === Ενημέρωση των ίδιων των υποψηφίων στο STORAGE_KEY ===
  let storedCandidates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  storedCandidates.forEach(c => {
    const id = c.id || c.playerName || c.characterName;
    c.points = scores[id] || 0;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCandidates));

  // === Αύξηση γύρου ===
  currentRound++;
  sessionStorage.setItem(SESSION_ROUND, currentRound);

  if (currentRound > numVoters) {
    window.location.href = "results.html";
  } else {
    positions = Array(numPositions).fill(null);
    renderPositions();
    window.location.href = "index.html";
  }
});*/


renderThumbs();
renderPositions();