/* =========================
   STORAGE – HISTÓRICO REAL
========================= */

const STORAGE_KEY = "neurocaa_boards";

/* =========================
   SALVAR PRANCHA ATUAL
========================= */

function saveCurrentBoard() {
  if (!window.currentBoard || window.currentBoard.length === 0) {
    alert("Nenhuma prancha para salvar.");
    return;
  }

  const boards = getSavedBoards();

  const boardTitle =
    document.getElementById("boardTitle")?.value?.trim() ||
    "Prancha sem título";

  const newBoard = {
    id: Date.now(),
    title: boardTitle,
    date: new Date().toLocaleString("pt-BR"),
    boardConfig: { ...window.boardConfig },
    boardData: JSON.parse(JSON.stringify(window.currentBoard))
  };

  boards.unshift(newBoard);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));

  renderHistory();
  showToast("Prancha salva com sucesso 💾");
}

/* =========================
   LISTAR PRANCHAS SALVAS
========================= */

function getSavedBoards() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/* =========================
   REABRIR PRANCHA
========================= */

function loadBoardById(id) {
  const boards = getSavedBoards();
  const board = boards.find(b => b.id === id);

  if (!board) {
    alert("Prancha não encontrada.");
    return;
  }

  window.boardConfig = { ...board.boardConfig };
  window.currentBoard = JSON.parse(JSON.stringify(board.boardData));

  document.getElementById("boardTitle").value = board.title;

  renderBoard();
}

/* =========================
   RENDER HISTÓRICO
========================= */

function renderHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = "";

  const boards = getSavedBoards();

  if (boards.length === 0) {
    historyList.innerHTML =
      "<p style='font-size:14px;color:#64748b'>Nenhuma prancha salva ainda.</p>";
    return;
  }

  boards.forEach(board => {
    const div = document.createElement("div");
    div.className = "history-item";

    div.innerHTML = `
      <strong>${board.title}</strong><br>
      <small>${board.date}</small><br>
      <button style="margin-top:6px" onclick="loadBoardById(${board.id})">
        🔁 Reabrir prancha
      </button>
    `;

    historyList.appendChild(div);
  });
}

/* =========================
   TOAST
========================= */

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = text;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", renderHistory);

/* =========================
   EXPOSIÇÃO GLOBAL
========================= */

window.saveCurrentBoard = saveCurrentBoard;
window.loadBoardById = loadBoardById;
