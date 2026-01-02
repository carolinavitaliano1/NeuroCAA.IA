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

  /* 🔥 NORMALIZA CONFIGURAÇÕES */
  const config = {
    columns: boardData.config?.columns ?? boardData.columns ?? 4,
    cellGap: boardData.config?.cellGap ?? boardData.cellGap ?? 10,

    cellBackgroundColor:
      boardData.config?.cellBackgroundColor ??
      boardData.cellBackgroundColor ??
      "#e5e7eb",

    cellBorderColor:
      boardData.config?.cellBorderColor ??
      boardData.cellBorderColor ??
      "#94a3b8",

    borderColor:
      boardData.config?.borderColor ??
      boardData.borderColor ??
      "#64748b",

    headerColor:
      boardData.config?.headerColor ??
      boardData.headerColor ??
      "#3b82f6",

    backgroundColor:
      boardData.config?.backgroundColor ??
      boardData.backgroundColor ??
      "#ffffff"
  };

  /* 🔥 NORMALIZA CÉLULAS */
  const board = (boardData.board || []).map(cell => ({
    image:
      cell.image ||
      cell.img ||
      cell.imageUrl ||
      cell.imagem ||
      "",
    text:
      cell.text ||
      cell.label ||
      cell.texto ||
      cell.nome ||
      ""
  }));

  const payload = {
    title: boardData.title || "Prancha Compartilhada",
    board,
    config,
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
