// ----- Προσωρινά δεδομένα για δοκιμή -----
const candidates = [
  { id: 1, name: "Θωμάς", character: "Shrek", photo: "images/thomas.jpg" },
  { id: 2, name: "Μαρία", character: "Fiona", photo: "images/maria.jpg" },
  { id: 3, name: "Νίκος", character: "Donkey", photo: "images/nikos.jpg" },
  { id: 4, name: "Κώστας", character: "Puss in Boots", photo: "images/kostas.jpg" }
];

// ----- Δημιουργία πεδίων θέσεων -----
const positionsContainer = document.getElementById("positions-container");
for (let i = 1; i <= 10; i++) {
  const slot = document.createElement("div");
  slot.classList.add("vote-slot");
  slot.dataset.position = i;
  slot.innerHTML = `<span>${i}</span>`;
  positionsContainer.appendChild(slot);
}

// ----- Δημιουργία μικρογραφιών υποψηφίων -----
const candidatesContainer = document.getElementById("candidates-container");
candidates.forEach(c => {
  const card = document.createElement("div");
  card.classList.add("candidate-thumb");
  card.draggable = true;
  card.dataset.id = c.id;
  card.innerHTML = `
    <img src="${c.photo}" alt="${c.name}">
    <p>${c.name}</p>
    <small>${c.character}</small>
  `;
  candidatesContainer.appendChild(card);
});

// ----- Drag & Drop -----
let dragged = null;

document.addEventListener("dragstart", e => {
  if (e.target.classList.contains("candidate-thumb")) {
    dragged = e.target;
    e.target.classList.add("dragging");
  }
});

document.addEventListener("dragend", e => {
  if (dragged) dragged.classList.remove("dragging");
  dragged = null;
});

document.querySelectorAll(".vote-slot").forEach(slot => {
  slot.addEventListener("dragover", e => e.preventDefault());
  slot.addEventListener("drop", e => {
    e.preventDefault();
    if (!dragged) return;
    // Αν υπάρχει ήδη κάποιος στη θέση -> επιστρέφει πίσω
    if (slot.querySelector(".candidate-thumb")) {
      const existing = slot.querySelector(".candidate-thumb");
      candidatesContainer.appendChild(existing);
    }
    slot.appendChild(dragged);
    checkIfComplete();
  });
});

// ----- Έλεγχος αν έχουν συμπληρωθεί 10 θέσεις -----
function checkIfComplete() {
  const filled = document.querySelectorAll(".vote-slot .candidate-thumb").length;
  document.getElementById("submit-vote").classList.toggle("hidden", filled < 10);
}

// ----- Υποβολή Ψήφου -----
document.getElementById("submit-vote").addEventListener("click", () => {
  const results = [];
  document.querySelectorAll(".vote-slot").forEach(slot => {
    const player = slot.querySelector(".candidate-thumb");
    if (player) {
      results.push({
        id: player.dataset.id,
        position: parseInt(slot.dataset.position)
      });
    }
  });

  // Υπολογισμός πόντων
  results.forEach(r => {
    const candidate = candidates.find(c => c.id == r.id);
    candidate.points = (11 - r.position);
  });

  console.log("Αποτελέσματα:", candidates);

  // Μήνυμα μετά την υποβολή
  document.getElementById("vote-section").innerHTML = `
    <h2>💚 Ευχαριστούμε για τη συμμετοχή σου!</h2>
    <button class="btn" onclick="window.location.reload()">Επόμενη Ψήφος</button>
  `;
});
