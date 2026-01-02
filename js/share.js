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

  // 🔥 BUSCA A PRANCHA COMPLETA (COM CONFIGURAÇÕES)
  firebase.database().ref(`boards/${boardId}`).once("value")
    .then(snapshot => {
      if (!snapshot.exists()) {
        alert("Prancha não encontrada.");
        return;
      }

      const boardData = snapshot.val();

      // ✅ SALVA TUDO NO sharedBoards
      return firebase.database()
        .ref(`sharedBoards/${shareId}`)
        .set({
          owner: user.uid,
          boardId: boardId,
          title: boardData.title || "",
          board: boardData.board || [],
          config: boardData.config || {},
          createdAt: new Date().toISOString()
        });
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

window.shareCurrentBoard = shareCurrentBoard;

