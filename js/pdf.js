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

  // 📸 Captura da prancha
  const canvas = await html2canvas(board, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scale: 2
  });

  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;

  // 📄 PDF A4 em pixels (jsPDF trabalha em mm por padrão)
  const pdf = new jsPDF('portrait', 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

  // 🔢 Tamanho da imagem no PDF mantendo proporção
  const imgWidth = pageWidth - 20; // margens laterais
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let x = 10; // margem esquerda
  let y = 10; // margem superior

  // 🧠 Se a prancha for mais alta que a página
  if (imgHeight > pageHeight - 20) {
    const scale = (pageHeight - 20) / imgHeight;
    pdf.addImage(
      imgData,
      'PNG',
      x,
      y,
      imgWidth * scale,
      imgHeight * scale
    );
  } else {
    pdf.addImage(
      imgData,
      'PNG',
      x,
      y,
      imgWidth,
      imgHeight
    );
  }

  pdf.save(`prancha-neurocaa-A4-${Date.now()}.pdf`);
}

