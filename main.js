// main.js — sequential candidate viewer for index.html
// Works with admin.js which stores candidates under "shrek_candidates" in localStorage.

function firstImg(candidate, ...keys) {
  for (const k of keys) {
    if (!candidate) continue;
    if (candidate[k]) return candidate[k];
  }
  return "";
}

// Load candidates and number of voters
const STORAGE_KEY = "shrek_candidates";
let candidates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let numVoters = parseInt(localStorage.getItem("num_voters"), 10) || 1;

// Session persistence
const SESSION_IDX = "shrek_idx";
const SESSION_ROUND = "shrek_round";
let idx = parseInt(sessionStorage.getItem(SESSION_IDX), 10);
if (Number.isNaN(idx)) idx = 0;
let currentRound = parseInt(sessionStorage.getItem(SESSION_ROUND), 10);
if (Number.isNaN(currentRound)) currentRound = 1;

// DOM refs
const characterImg = document.getElementById("characterImg");
const characterName = document.getElementById("characterName");
const playerImg = document.getElementById("playerImg");
const playerName = document.getElementById("playerName");
const nextBtn = document.getElementById("nextBtn");
const voteBtn = document.getElementById("voteBtn");

// Show candidate at index i
function showCandidate(i) {
  if (i >= candidates.length) {
    // Τέλος υποψηφίων, εμφάνιση vote button
    nextBtn.classList.add("hidden");
    voteBtn.classList.remove("hidden");

    // Hide images
    characterImg.style.display = "none";
    playerImg.style.display = "none";

    characterName.textContent = "Τέλος προβολής υποψηφίων";
    playerName.textContent = "Πάτα Ψήφισε για να ψηφίσεις";

    sessionStorage.setItem(SESSION_IDX, candidates.length);
    return;
  }

  const c = candidates[i];
  const charImg = firstImg(c, "characterPhoto", "character_photo", "charDataURL", "characterImg", "characterImage");
  const playerImgSrc = firstImg(c, "playerPhoto", "player_photo", "personDataURL", "playerImg", "playerImage");

  characterImg.src = charImg || "";
  playerImg.src = playerImgSrc || "";

  characterImg.style.display = "";
  playerImg.style.display = "";

  characterName.textContent = c.characterName || c.charName || "Άγνωστος Χαρακτήρας";
  playerName.textContent = c.playerName || c.name || "Άγνωστος Παίκτης";

  nextBtn.classList.remove("hidden");
  voteBtn.classList.add("hidden");

  sessionStorage.setItem(SESSION_IDX, i);
}

// Next button
nextBtn.addEventListener("click", () => {
  idx++;
  showCandidate(idx);
});

// Vote button — πάει στο vote page
voteBtn.addEventListener("click", () => {
  sessionStorage.setItem(SESSION_IDX, 0); // επαναφορά index υποψηφίων
  sessionStorage.setItem(SESSION_ROUND, currentRound); // φύλαξη γύρου
  window.location.href = "vote.html";
});

// Initial render
if (candidates.length === 0) {
  alert("Δεν υπάρχουν υποψήφιοι — πήγαινε στο Admin για να προσθέσεις.");
  window.location.href = "admin.html";
} else {
  showCandidate(idx);
}
