/* =========================
   STORAGE – HISTÓRICO NEUROCAA
========================= */

const STORAGE_KEY = "neurocaa_history";

/* =========================
   SALVAR PRANCHA
========================= */

function saveBoard() {
  if (!window.currentBoard || window.currentBoard.length === 0) {
    alert("Não há prancha para salvar.");
    return;
  }

  const phrase = document.getElementById("phraseInput")?.value || "";
  const title  = document.getElementById("boardTitle")?.value || "";

  const boardData = {
    id: Date.now(),
    phrase,
    title,
    board: JSON.parse(JSON.stringify(window.currentBoard)),
    config: { ...window.boardConfig },
    createdAt: new Date().toISOString()
  };

  window.lastSavedBoardId = boardData.id;

  const history = getHistory();
  history.unshift(boardData);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderHistory();
}

/* =========================
   HISTÓRICO
========================= */

function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/* =========================
   RENDERIZAR HISTÓRICO
========================= */

function renderHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  const history = getHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML =
      "<p style='color:#64748b;font-size:14px'>Nenhuma prancha salva ainda.</p>";
    return;
  }

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    const date = new Date(item.createdAt).toLocaleString("pt-BR");

    div.innerHTML = `
      <strong>${item.title || item.phrase || "Prancha sem título"}</strong>
      <div style="font-size:12px;color:#64748b;margin:4px 0">${date}</div>

      <div style="display:flex; gap:8px; margin-top:6px">
        <button onclick="loadFromHistory(${item.id})">Abrir</button>
        <button onclick="deleteFromHistory(${item.id})" style="background:#ef4444;color:#fff">
          Excluir
        </button>
      </div>
    `;

    historyList.appendChild(div);
  });
}

/* =========================
   CARREGAR PRANCHA
========================= */

function loadFromHistory(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (!item) return;

  window.currentBoard = JSON.parse(JSON.stringify(item.board));
  window.boardConfig = { ...item.config };
  window.lastSavedBoardId = item.id;

  document.getElementById("phraseInput").value = item.phrase || "";
  document.getElementById("boardTitle").value  = item.title || "";

  if (typeof renderBoard === "function") {
    renderBoard();
  }
}

/* =========================
   EXCLUIR UMA PRANCHA
========================= */

function deleteFromHistory(id) {
  if (!confirm("Deseja excluir esta prancha?")) return;

  let history = getHistory();
  history = history.filter(item => item.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  // se excluiu a prancha atual
  if (window.lastSavedBoardId === id) {
    window.lastSavedBoardId = null;
  }

  renderHistory();
}

/* =========================
   LIMPAR TUDO
========================= */

function clearHistory() {
  if (!confirm("Deseja apagar todo o histórico?")) return;
  localStorage.removeItem(STORAGE_KEY);
  window.lastSavedBoardId = null;
  renderHistory();
}

/* =========================
   INICIALIZA
========================= */

document.addEventListener("DOMContentLoaded", renderHistory);

/* =========================
   EXPOR FUNÇÕES
========================= */

window.saveBoard = saveBoard;
window.loadFromHistory = loadFromHistory;
window.deleteFromHistory = deleteFromHistory;
window.clearHistory = clearHistory;
