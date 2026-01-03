/* =========================
   STORAGE – HISTÓRICO NEUROCAA
   (LOCAL + FIREBASE)
========================= */

const STORAGE_KEY = "neurocaa_history";

/* =========================
   SALVAR PRANCHA NO HISTÓRICO
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

  // 🔑 essencial para compartilhamento
  window.lastSavedBoardId = boardData.id;

  saveBoardToLocalHistory(boardData);
  renderHistory();
}

/* =========================
   SALVAR LOCALMENTE
========================= */

function saveBoardToLocalHistory(boardData) {
 	tfconst history =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  history.unshift(boardData);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );
}

/* =========================
   OBTER HISTÓRICO
========================= */

function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/* =========================
   EXCLUIR PRANCHA DO HISTÓRICO
========================= */

function deleteFromHistory(id) {
  if (!confirm("Deseja excluir esta prancha do histórico?")) return;

  let history = getHistory();
  history = history.filter(item => item.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  renderHistory();
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

      <div style="font-size:12px;color:#64748b;margin:4px 0">
        ${date}
      </div>

      <div style="display:flex; gap:8px; margin-top:6px;">
        <button onclick="loadFromHistory(${item.id})">
          Abrir prancha
        </button>

        <button style="background:#ef4444;color:white"
          onclick="deleteFromHistory(${item.id})">
          🗑️ Excluir
        </button>
      </div>
    `;

    historyList.appendChild(div);
  });
}

/* =========================
   CARREGAR PRANCHA DO HISTÓRICO
========================= */

function loadFromHistory(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (!item) return;

  window.currentBoard = JSON.parse(JSON.stringify(item.board));
  window.boardConfig = { ...item.config };

  const phraseInput = document.getElementById("phraseInput");
  const titleInput = document.getElementById("boardTitle");

  if (phraseInput) phraseInput.value = item.phrase || "";
  if (titleInput) titleInput.value = item.title || "";

  if (typeof renderBoard === "function") {
    renderBoard();
  }
}

/* =========================
   LIMPAR HISTÓRICO COMPLETO
========================= */

function clearHistory() {
  if (!confirm("Deseja apagar todo o histórico?")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

/* =========================
   COMPARTILHAR PRANCHA (FIREBASE)
========================= */

function shareBoard(boardId) {
  if (!boardId) {
    alert("Salve a prancha antes de compartilhar.");
    return;
  }

  const history = getHistory();
  const boardData = history.find(b => b.id === boardId);

  if (!boardData) {
    alert("Prancha não encontrada no histórico.");
    return;
  }

  const shareId = crypto.randomUUID();

  const payload = {
    phrase: boardData.phrase || "",
    title: boardData.title || "",
    board: boardData.board,
    config: boardData.config || {},
    createdAt: new Date().toISOString()
  };

  firebase.database()
    .ref("sharedBoards/" + shareId)
    .set(payload)
    .then(() => {
      const link = `${window.location.origin}/view.html?share=${shareId}`;
      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado! Prancha compartilhada com sucesso.");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao compartilhar a prancha.");
    });
}

// expõe global
window.shareCurrentBoard = shareBoard;

/* =========================
   INICIALIZA
========================= */

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
});

/* =========================
   EXPOR FUNÇÕES GLOBAIS
========================= */

window.saveBoard = saveBoard;
window.renderHistory = renderHistory;
window.loadFromHistory = loadFromHistory;
window.clearHistory = clearHistory;
window.deleteFromHistory = deleteFromHistory;
window.shareCurrentBoard = shareBoard;
