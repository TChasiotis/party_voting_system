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
  localStorage.setItem("last_vote", JSON.stringify(positions));

  // === Υπολογισμός και αποθήκευση πόντων ===
  let scores = JSON.parse(localStorage.getItem("shrek_scores")) || {};
  const maxPoints = numPositions; // π.χ. 10 θέσεις -> 10 πόντοι στην 1η θέση

  positions.forEach((c, i) => {
    if (!c) return;
    const id = c.id || c.characterName || c.playerName;
    const pointsToAdd = maxPoints - i; // θέση 1 -> 10, θέση 2 -> 9 ...
    scores[id] = (scores[id] || 0) + pointsToAdd; // ✅ προσθήκη στους παλιούς πόντους
  });

  localStorage.setItem("shrek_scores", JSON.stringify(scores));
  // ==========================================

  // Αύξηση γύρου ψηφοφόρου
  currentRound++;
  sessionStorage.setItem(SESSION_ROUND, currentRound);

  if (currentRound > numVoters) {
    // Τελείωσαν όλοι οι ψηφοφόροι → results
    window.location.href = "results.html";
  } else {
    // Επόμενος ψηφοφόρος
    positions = Array(numPositions).fill(null);
    renderPositions();
    window.location.href = "index.html";
  }
});


/*// Submit vote
submitBtn.addEventListener("click", () => {
  localStorage.setItem("last_vote", JSON.stringify(positions));

  // Αυξηση γύρου ψηφοφόρου
  currentRound++;
  sessionStorage.setItem(SESSION_ROUND, currentRound);

  if (currentRound > numVoters) {
    // Τελείωσαν όλοι οι ψηφοφόροι → results
    window.location.href = "results.html";
  } else {
    // Επόμενος ψηφοφόρος: καθάρισμα θέσεων & επιστροφή σε index
    positions = Array(numPositions).fill(null);
    renderPositions();
    window.location.href = "index.html";
  }
});*/

renderThumbs();
renderPositions();