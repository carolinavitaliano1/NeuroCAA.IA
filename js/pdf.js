/* =========================
   EXPORTAÇÃO DA PRANCHA EM PDF (A4)
   Com créditos institucionais
========================= */

async function exportBoardToPDF() {
  const board = document.getElementById('board');
  if (!board) return;

  /* =========================
     CONFIGURAÇÃO A4
  ========================= */
  const pageWidth = 210; // mm
  const marginTop = 15;

  /* =========================
     CLONE DA PRANCHA
  ========================= */
  const clone = board.cloneNode(true);
  clone.style.width = 'auto';
  clone.style.maxWidth = 'none';
  clone.style.background = '#ffffff';
  clone.style.boxSizing = 'border-box';

  /* =========================
     CRÉDITOS – LINHA ÚNICA (PADRÃO ARASAAC)
  ========================= */
  const creditsLine = document.createElement('div');
  creditsLine.style.marginTop = '6px';
  creditsLine.style.fontSize = '8px';
  creditsLine.style.color = '#555';
  creditsLine.style.textAlign = 'center';
  creditsLine.style.whiteSpace = 'nowrap';

  creditsLine.textContent =
    '© 2025 – NeuroCAA | Carol Gurgel · Sistema protegido por direitos autorais · Pictogramas ARASAAC (CC BY-NC-SA 4.0)';

  clone.appendChild(creditsLine);

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

  const baseCellMM = 42; // tamanho base por célula
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

  /* =========================
     CENTRALIZAÇÃO NA PÁGINA
  ========================= */
  const xCentered = (pageWidth - imgWidth) / 2;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  pdf.addImage(
    imgData,
    'PNG',
    xCentered,
    marginTop,
    imgWidth,
    imgHeight
  );

  pdf.save(`prancha-neurocaa-A4-${Date.now()}.pdf`);

  document.body.removeChild(temp);
}
