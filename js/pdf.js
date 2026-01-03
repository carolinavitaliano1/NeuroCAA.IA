/* =========================
   EXPORTAÇÃO DA PRANCHA EM PDF (A4)
   Imagens proporcionais + créditos no rodapé
========================= */

async function exportBoardToPDF() {
  const board = document.getElementById("board");
  if (!board) return;

  // 🔴 ESCONDE OS BOTÕES ❌ TEMPORARIAMENTE
  const removeButtons = board.querySelectorAll(".remove-btn");
  removeButtons.forEach(btn => btn.style.display = "none");

  const { jsPDF } = window.jspdf;

  const canvas = await html2canvas(board, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // 🔥 QUEBRA AUTOMÁTICA EM VÁRIAS PÁGINAS
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("prancha-neurocaa.pdf");

  // 🟢 RESTAURA OS BOTÕES ❌
  removeButtons.forEach(btn => btn.style.display = "");
}

  /* =========================
     CONFIGURAÇÃO A4
  ========================= */
  const pageWidth = 210;   // mm
  const pageHeight = 297;  // mm
  const marginTop = 15;
  const marginBottom = 12;

  /* =========================
     CLONE DA PRANCHA
  ========================= */
  const clone = board.cloneNode(true);
  clone.style.width = 'auto';
  clone.style.maxWidth = 'none';
  clone.style.background = '#ffffff';
  clone.style.boxSizing = 'border-box';

  /* =========================
     GARANTIR IMAGENS PROPORCIONAIS
  ========================= */
  clone.querySelectorAll('img').forEach(img => {
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.margin = '0 auto';
  });

  /* =========================
     CONTAINER TEMPORÁRIO
  ========================= */
  const temp = document.createElement('div');
  temp.style.position = 'fixed';
  temp.style.left = '-9999px';
  temp.style.top = '0';
  temp.appendChild(clone);
  document.body.appendChild(temp);

  /* =========================
     CÁLCULO DINÂMICO POR COLUNAS
  ========================= */
  const columns =
    window.boardConfig?.columnsCount ||
    getComputedStyle(board).gridTemplateColumns.split(' ').length;

  const baseCellMM = 42;
  const gapMM = (window.boardConfig?.cellGap || 10) * 0.25;

  const estimatedWidthMM =
    columns * baseCellMM + (columns - 1) * gapMM;

  const maxUsableWidth = pageWidth - 20;
  const scale = maxUsableWidth / estimatedWidthMM;

  clone.style.transform = `scale(${scale})`;
  clone.style.transformOrigin = 'top left';

  /* =========================
     HTML → CANVAS
  ========================= */
  const canvas = await html2canvas(clone, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');

  const imgWidth = maxUsableWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const xCentered = (pageWidth - imgWidth) / 2;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  /* =========================
     ADICIONA PRANCHA
  ========================= */
  pdf.addImage(
    imgData,
    'PNG',
    xCentered,
    marginTop,
    imgWidth,
    imgHeight
  );

  /* =========================
     CRÉDITOS NO RODAPÉ (FORA DA BORDA)
  ========================= */
  pdf.setFontSize(8);
  pdf.setTextColor(90);

  const creditsText =
    '© 2025 – NeuroCAA | Carol Gurgel · Sistema protegido por direitos autorais · Pictogramas ARASAAC (CC BY-NC-SA 4.0)';

  pdf.text(
    creditsText,
    pageWidth / 2,
    pageHeight - marginBottom,
    { align: 'center' }
  );

  pdf.save(`prancha-neurocaa-A4-${Date.now()}.pdf`);

  document.body.removeChild(temp);
}
