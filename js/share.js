function shareBoard(boardId) {
  if (!boardId) {
    alert("Salve a prancha antes de compartilhar.");
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Usuário não logado");
    return;
  }

  const shareId = crypto.randomUUID();

  firebase.database()
    .ref(`boards/${user.uid}/${boardId}`)
    .update({
      shareId
    })
    .then(() => {
      const link = `${location.origin}/view.html?share=${shareId}`;
      navigator.clipboard.writeText(link);
      alert("🔗 Link copiado para compartilhar!");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao compartilhar");
    });
}

// 🔓 EXPÕE PARA O HTML
window.shareCurrentBoard = shareBoard;
