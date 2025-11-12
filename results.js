// results.js — Τελική κατάταξη + podium

const STORAGE_KEY = "shrek_candidates";
let candidates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let scores = JSON.parse(localStorage.getItem("shrek_scores")) || {};

// Προσθήκη πόντων στους υποψηφίους
candidates.forEach(c => {
  const id = c.id || c.characterName || c.playerName;
  c.points = scores[id] || 0;
});

// Ταξινόμηση και επιλογή top 10
candidates.sort((a, b) => b.points - a.points);
const top10 = candidates.slice(0, 10);

const container = document.getElementById("resultsContainer");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restart-btn");
let index = 0;

// Παρουσίαση 10ου -> 1ου
function showNext() {
  if (index < top10.length) {
    const c = top10[top10.length - 1 - index]; // Από τον 10ο προς τον 1ο
    container.innerHTML = `
      <div class="text-center">
        <img src="${c.characterPhoto || c.charDataURL || 'https://via.placeholder.com/150'}"
             width="180" height="180" alt="">
        <h2>${c.characterName || "Άγνωστος"}</h2>
        <p>${c.playerName || ""}</p>
        <p><b>Πόντοι:</b> ${c.points}</p>
      </div>`;
    index++;
    if (index === top10.length) nextBtn.textContent = "Δες όλη τη δεκάδα";
  } else {
    showPodium();
  }
}

// Εμφάνιση τελικού podium
function showPodium() {
  container.innerHTML = `
    <div class="podium">
      <div class="podium-item" style="transform:translateY(30px);">
        <div class="medal">🥈</div>
        <img src="${top10[1].characterPhoto || 'https://via.placeholder.com/150'}">
        <h3>${top10[1].characterName}</h3>
        <p>${top10[1].points} πόντοι</p>
      </div>

      <div class="podium-item">
        <div class="medal">🥇</div>
        <img src="${top10[0].characterPhoto || 'https://via.placeholder.com/150'}">
        <h3>${top10[0].characterName}</h3>
        <p>${top10[0].points} πόντοι</p>
      </div>

      <div class="podium-item" style="transform:translateY(60px);">
        <div class="medal">🥉</div>
        <img src="${top10[2].characterPhoto || 'https://via.placeholder.com/150'}">
        <h3>${top10[2].characterName}</h3>
        <p>${top10[2].points} πόντοι</p>
      </div>
    </div>

    <div class="top10-list">
      ${top10.slice(3).map((c, i) => `
        <div class="top10-item">
          <span>${i + 4}. ${c.characterName}</span>
          <span>${c.points} πόντοι</span>
        </div>`).join("")}
    </div>
  `;

  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
}

// Κουμπιά
nextBtn.addEventListener("click", showNext);
restartBtn.addEventListener("click", () => {
  localStorage.removeItem("shrek_scores");
  sessionStorage.clear();
  window.location.href = "index.html";
});

// Ξεκίνα με τον 10ο
if (top10.length > 0) {
  showNext();
} else {
  container.innerHTML = "<p>Δεν υπάρχουν αποτελέσματα ακόμα.</p>";
  nextBtn.style.display = "none";
}
