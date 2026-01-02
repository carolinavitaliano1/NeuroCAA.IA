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

  const shareId = crypto.randomUUID();

  firebase.database()
    .ref(`sharedBoards/${shareId}`)
    .set({
      owner: user.uid,
      boardId: boardId,
      createdAt: new Date().toISOString()
    })
    .then(() => {
      const link = `${location.origin}/view.html?share=${shareId}`;
      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado para compartilhar!");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao gerar link.");
    });
}

// 🔓 EXPÕE GLOBALMENTE (ESSENCIAL)
window.shareCurrentBoard = shareCurrentBoard;
