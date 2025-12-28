async function exportBoardToPDF() {
  const board = document.getElementById('board');
  if (!board) return;

  /* =========================
     CONFIGURAÇÃO A4 (mm)
  ========================= */
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;

  /* =========================
     CLONAR PRANCHA (PDF SAFE)
  ========================= */
  const clone = board.cloneNode(true);
  clone.style.width = 'auto';
  clone.style.maxWidth = 'none';
  clone.style.background = '#ffffff';
  clone.style.boxSizing = 'border-box';

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
     AJUSTE DINÂMICO DA LARGURA
     baseado no número de colunas
  ========================= */
  const columns =
    window.boardConfig?.columnsCount ||
    getComputedStyle(board).gridTemplateColumns.split(' ').length;

  const cellSize = 40; // mm base por célula
  const gap = (window.boardConfig?.cellGap || 10) * 0.3;

  const estimatedWidth =
    columns * cellSize + (columns - 1) * gap;

  const scale =
    (pageWidth - margin * 2) / estimatedWidth;

  clone.style.transform = `scale(${scale})`;
  clone.style.transformOrigin = 'top left';

  /* =========================
     RENDER CANVAS
  ========================= */
  const canvas = await html2canvas(clone, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    allowTaint: true
  });

  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(
    imgData,
    'PNG',
    margin,
    margin,
    imgWidth,
    imgHeight
  );

  pdf.save(`prancha-neurocaa-A4-${Date.now()}.pdf`);

  document.body.removeChild(temp);
}

