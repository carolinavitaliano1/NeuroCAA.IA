function shareCurrentBoard(boardId) {
  if (!boardId) {
    alert("Salve a prancha antes de compartilhar.");
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Usuário não autenticado.");
    return;
  }

  // 🔎 Busca a prancha no histórico local
  const history =
    JSON.parse(localStorage.getItem("neurocaa_history")) || [];

  const boardData = history.find(b => b.id === boardId);

  if (!boardData) {
    alert("Prancha não encontrada no histórico.");
    return;
  }

  // 🛑 Blindagem absoluta
  if (!Array.isArray(boardData.board)) {
    console.error("BOARD INVÁLIDO:", boardData.board);
    alert("Erro interno: prancha corrompida.");
    return;
  }

  const shareId = crypto.randomUUID();

  const payload = {
    owner: user.uid,
    board: boardData.board,      // ✅ ARRAY
    phrase: boardData.phrase || "",
    title: boardData.title || "",
    config: boardData.config || {},
    createdAt: new Date().toISOString()
  };

  firebase.database()
    .ref(`sharedBoards/${shareId}`)
    .set(payload)
    .then(() => {
      const link = `${location.origin}/view.html?share=${shareId}`;
      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado! Prancha compartilhada com sucesso.");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao gerar link.");
    });
}

// 🔓 EXPÕE GLOBALMENTE (ESSENCIAL)
window.shareCurrentBoard = shareCurrentBoard;

