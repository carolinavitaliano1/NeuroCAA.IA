function shareCurrentBoard(boardId) {
  if (!boardId) {
    alert("Salve a prancha antes de compartilhar.");
    return;
  }
  const history =
    JSON.parse(localStorage.getItem("neurocaa_history")) || [];
  const boardData = history.find(b => b.id === boardId);
  if (!boardData) {
    alert("Prancha não encontrada.");
    return;
  }
  const shareId = crypto.randomUUID();
  const payload = {
    title: boardData.title || "",
    phrase: boardData.phrase || "",
    board: boardData.board || [],
    config: boardData.config || {},   // 🔥 AQUI ESTAVA O PROBLEMA
    createdAt: new Date().toISOString()
  };
  firebase.database()
    .ref("sharedBoards/" + shareId)
    .set(payload)
    .then(() => {
      const link = `${location.origin}/view.html?share=${shareId}`;
      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado!");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao compartilhar.");
    });
}
window.shareCurrentBoard = shareCurrentBoard;

