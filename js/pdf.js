async function exportBoardToPDF() {
  const board = document.getElementById('board');
  if (!board) return;

  // 🔄 Aguarda todas as imagens carregarem
  const images = board.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  // 📸 Captura com CORS liberado
  const canvas = await html2canvas(board, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scale: 2
  });

  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(
    imgData,
    'PNG',
    0,
    0,
    canvas.width,
    canvas.height
  );

  pdf.save(`prancha-neurocaa-${Date.now()}.pdf`);
}
