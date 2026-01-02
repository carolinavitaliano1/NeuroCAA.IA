/* =========================
   COMPARTILHAR PRANCHA (FINAL)
   Salva a prancha COMPLETA no Firebase
========================= */

function shareCurrentBoard(boardId) {
  if (!boardId) {
    alert("Salve a prancha antes de compartilhar.");
    return;
  }

  // 🔎 busca a prancha no histórico local
  const history =
    JSON.parse(localStorage.getItem("neurocaa_history")) || [];

  const boardData = history.find(b => b.id === boardId);

  if (!boardData || !Array.isArray(boardData.board)) {
    alert("Prancha inválida ou não encontrada.");
    return;
  }

  const shareId = crypto.randomUUID();

  // 📦 payload COMPLETO (isso é o que o view.html espera)
  const payload = {
    phrase: boardData.phrase || "",
    title: boardData.title || "",
    board: boardData.board,
    config: boardData.config || {},
    createdAt: new Date().toISOString()
  };

  firebase
    .database()
    .ref("sharedBoards/" + shareId)
    .set(payload)
    .then(() => {
      const link =
        `${window.location.origin}/view.html?share=${shareId}`;

      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado! Prancha compartilhada com sucesso.");
      console.log("Link gerado:", link);
    })
    .catch(err => {
      console.error("Erro ao compartilhar:", err);
      alert("Erro ao compartilhar a prancha.");
    });
}

// 🔓 expõe globalmente (ESSENCIAL)
window.shareCurrentBoard = shareCurrentBoard;
