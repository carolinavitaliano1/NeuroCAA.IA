function shareCurrentBoard(boardId) {
  if (!boardId) {
    alert("Salve a prancha antes de compartilhar.");
    return;
  }

  const history =
    JSON.parse(localStorage.getItem("neurocaa_history")) || [];

  const boardData = history.find(b => String(b.id) === String(boardId));

  if (!boardData) {
    alert("Prancha não encontrada no histórico.");
    return;
  }

  const shareId = crypto.randomUUID();

  const payload = {
    title: boardData.title || "Prancha Compartilhada",
    board: boardData.board || [],
    config: boardData.config || {},
    createdAt: new Date().toISOString()
  };

  firebase
    .database()
    .ref("sharedBoards/" + shareId)
    .set(payload)
    .then(() => {
      const link = `${location.origin}/view.html?share=${shareId}`;
      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado! Prancha compartilhada com sucesso.");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao compartilhar prancha.");
    });
}

window.shareCurrentBoard = shareCurrentBoard;
