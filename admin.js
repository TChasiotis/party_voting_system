const PASSWORD = "WeLoveAthanasia2002";
const STORAGE_KEY = "shrek_candidates";

const loginSection = document.getElementById("login-section");
const managementSection = document.getElementById("management-section");
const loginBtn = document.getElementById("login-btn");
const candidatesList = document.getElementById("candidates-list");
const form = document.getElementById("candidate-form");
const saveChangesBtn = document.getElementById("save-changes");
const goIndexBtn = document.getElementById("go-index");

let candidates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 🔐 Login
loginBtn.addEventListener("click", () => {
  const inputPass = document.getElementById("admin-password").value.trim();
  if (inputPass === PASSWORD) {
    loginSection.classList.add("hidden");
    managementSection.classList.remove("hidden");
    renderCandidates();
  } else {
    alert("Λάθος κωδικός!");
  }
});

// 🧍‍♂️ Εμφάνιση υποψηφίων
function renderCandidates() {
  candidatesList.innerHTML = "";
  candidates.forEach((c, index) => {
    const div = document.createElement("div");
    div.classList.add("candidate-card-admin");
    div.innerHTML = `
      <div class="admin-card">
        <img src="${c.playerPhoto || ""}" alt="Player">
        <div>
          <h4>${c.playerName || "—"}</h4>
          <small>${c.characterName || "—"}</small>
        </div>
      </div>
      <div class="admin-actions">
        <button class="btn edit" data-index="${index}">✏️ Επεξεργασία</button>
        <button class="btn remove" data-index="${index}">🗑️ Διαγραφή</button>
      </div>
    `;
    candidatesList.appendChild(div);
  });

  document.querySelectorAll(".edit").forEach(btn =>
    btn.addEventListener("click", e => editCandidate(e.target.dataset.index))
  );
  document.querySelectorAll(".remove").forEach(btn =>
    btn.addEventListener("click", e => removeCandidate(e.target.dataset.index))
  );
}

// ➕ Προσθήκη / Επεξεργασία
form.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;
  const playerName = document.getElementById("player-name").value.trim();
  const characterName = document.getElementById("character-name").value.trim();

  const playerPhotoFile = document.getElementById("player-photo").files[0];
  const characterPhotoFile = document.getElementById("character-photo").files[0];

  const readerPromises = [];
  readerPromises.push(playerPhotoFile ? readFile(playerPhotoFile) : Promise.resolve(null));
  readerPromises.push(characterPhotoFile ? readFile(characterPhotoFile) : Promise.resolve(null));

  Promise.all(readerPromises).then(([playerPhoto, characterPhoto]) => {
    const newCandidate = {
      id: id ? parseInt(id) : Date.now(),
      playerName,
      playerPhoto: playerPhoto || (id ? candidates.find(c => c.id == id).playerPhoto : ""),
      characterName,
      characterPhoto: characterPhoto || (id ? candidates.find(c => c.id == id).characterPhoto : ""),
      points: id ? candidates.find(c => c.id == id).points : 0
    };

    if (id) {
      const idx = candidates.findIndex(c => c.id == id);
      candidates[idx] = newCandidate;
    } else {
      candidates.push(newCandidate);
    }

    form.reset();
    document.getElementById("edit-id").value = "";
    renderCandidates();
  });
});

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// 🗑️ Διαγραφή
function removeCandidate(index) {
  if (confirm("Να διαγραφεί σίγουρα;")) {
    candidates.splice(index, 1);
    renderCandidates();
  }
}

// ✏️ Επεξεργασία
function editCandidate(index) {
  const c = candidates[index];
  document.getElementById("edit-id").value = c.id;
  document.getElementById("player-name").value = c.playerName;
  document.getElementById("character-name").value = c.characterName;
}

// --- αριθμός ψηφοφόρων ---
const numVotersInput = document.getElementById("num-voters");

// Αποθήκευση αλλαγών & num voters
saveChangesBtn.addEventListener("click", () => {
  const numVoters = parseInt(numVotersInput.value) || 1;
  localStorage.setItem("num_voters", numVoters);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  alert("Οι αλλαγές αποθηκεύτηκαν!");
});

// ⬇️ Export JSON
document.getElementById("export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(candidates, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shrek_candidates_backup.json";
  a.click();
});

// ⬆️ Import JSON
document.getElementById("import-json").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      candidates = JSON.parse(ev.target.result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
      renderCandidates();
      alert("Το αρχείο εισήχθη επιτυχώς!");
    } catch (err) {
      alert("Σφάλμα στο αρχείο JSON!");
    }
  };
  reader.readAsText(file);
});

// 🏠 Επιστροφή στην αρχική
goIndexBtn.addEventListener("click", () => {
  sessionStorage.removeItem("shrek_idx");
  window.location.href = "index.html";
});
