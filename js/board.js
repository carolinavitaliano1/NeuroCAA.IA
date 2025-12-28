/* =========================
   ESTADO GLOBAL DA PRANCHA
========================= */

window.currentBoard = [];
window.boardConfig = {
  headerColor: null,
  cellBgColor: null,
  cellBorderColor: null,
  boardBorderColor: null,
  columnsCount: null,
  cellGap: null
};

/* =========================
   INICIALIZA CONFIGURAÇÕES
========================= */

document.addEventListener('DOMContentLoaded', () => {
  populateCAASelects();
});

/* =========================
   POPULAR SELECTS COM CORES CAA
========================= */

function populateCAASelects() {
  const selects = [
    'headerColor',
    'cellBgColor',
    'cellBorderColor',
    'boardBorderColor'
  ];

  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">Selecione…</option>`;

    CAA_COLORS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.color;

      // Cabeçalho e borda da prancha → só nome da cor
      if (id === 'headerColor' || id === 'boardBorderColor') {
        opt.textContent = c.name;
      } 
      // Células → nome + função CAA
      else {
        opt.textContent = `${c.name} – ${c.label}`;
      }

      select.appendChild(opt);
    });
  });
}

/* =========================
   GERAR PRANCHA (COM FEEDBACK VISUAL)
========================= */

async function generateBoard() {
  const phraseInput = document.getElementById('phraseInput');
  const generateBtn = document.querySelector('.generate');

  if (!phraseInput || !generateBtn) return;

  const phrase = phraseInput.value.trim();
  if (!phrase) return;

  // 🔄 Estado visual: gerando
  generateBtn.textContent = '⏳ Gerando...';
  generateBtn.disabled = true;

  window.currentBoard = [];
  const words = phrase.split(/\s+/);

  for (const word of words) {
    let data = [];
    try {
      const res = await fetch(API + encodeURIComponent(word));
      data = await res.json();
    } catch {
      console.warn('Erro ao buscar pictograma:', word);
    }

    const pic = data[0];

    window.currentBoard.push({
      word,
      customText: null,
      img: pic
        ? `https://static.arasaac.org/pictograms/${pic._id}/${pic._id}_300.png`
        : null,
      bgColor: null,
      borderColor: null
    });
  }

  renderBoard();

  // ✅ Volta ao estado normal
  generateBtn.textContent = 'Gerar';
  generateBtn.disabled = false;
}

/* =========================
   RENDERIZAR PRANCHA
========================= */

function renderBoard() {
  const board = document.getElementById('board');
  if (!board) return;

  board.innerHTML = '';

  // Colunas
  if (boardConfig.columnsCount) {
    board.style.gridTemplateColumns =
      `repeat(${boardConfig.columnsCount}, 1fr)`;
  } else {
    board.style.gridTemplateColumns = '';
  }

  // Espaçamento
  if (boardConfig.cellGap !== null && boardConfig.cellGap !== '') {
    board.style.gap = `${boardConfig.cellGap}px`;
  } else {
    board.style.gap = '';
  }

  // Borda da prancha
  if (boardConfig.boardBorderColor) {
    board.style.border = `4px solid ${boardConfig.boardBorderColor}`;
    board.style.borderRadius = '12px';
    board.style.padding = '10px';
  } else {
    board.style.border = '';
    board.style.padding = '';
  }

  /* =========================
     CABEÇALHO (COM OU SEM TÍTULO)
  ========================= */

  const title = document.getElementById('boardTitle')?.value.trim();

  const headerDiv = document.createElement('div');
  headerDiv.style.gridColumn = '1 / -1';
  headerDiv.style.marginBottom = '10px';
  headerDiv.style.textAlign = 'center';

  if (title) {
    headerDiv.textContent = title;
    headerDiv.style.fontWeight = '700';
    headerDiv.style.padding = '8px';

    if (boardConfig.headerColor) {
      headerDiv.style.background = boardConfig.headerColor;
      headerDiv.style.borderRadius = '8px';
    }
  } else {
    // Placeholder invisível para manter layout
    headerDiv.style.height = '16px';
  }

  board.appendChild(headerDiv);

  /* =========================
     CÉLULAS
  ========================= */

  window.currentBoard.forEach((item, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const bg = item.bgColor || boardConfig.cellBgColor || '#ffffff';
    const border = item.borderColor || boardConfig.cellBorderColor || '#e2e8f0';

    cell.style.background = bg;
    cell.style.border = `2px solid ${border}`;

    cell.innerHTML = `
      <div class="remove-btn" title="Remover pictograma">×</div>
      ${item.img ? `<img src="${item.img}" alt="${item.word}">` : ''}
      <div>${item.customText || item.word}</div>
    `;

    // Remover pictograma
    cell.querySelector('.remove-btn').onclick = (e) => {
      e.stopPropagation();
      window.currentBoard.splice(index, 1);
      renderBoard();
    };

    // Abrir modal
    cell.onclick = () => {
      if (typeof openQuickEditModal === 'function') {
        openQuickEditModal(index);
      }
    };

    board.appendChild(cell);
  });
}

/* =========================
   APLICAR CONFIGURAÇÕES
========================= */

function applyBoardConfig() {
  boardConfig.headerColor =
    document.getElementById('headerColor')?.value || null;

  boardConfig.cellBgColor =
    document.getElementById('cellBgColor')?.value || null;

  boardConfig.cellBorderColor =
    document.getElementById('cellBorderColor')?.value || null;

  boardConfig.boardBorderColor =
    document.getElementById('boardBorderColor')?.value || null;

  boardConfig.columnsCount =
    Number(document.getElementById('columnsCount')?.value) || null;

  boardConfig.cellGap =
    Number(document.getElementById('cellGap')?.value) || null;

  renderBoard();
}

/* =========================
   LIMPAR
========================= */

function clearBoard() {
  window.currentBoard = [];
  document.getElementById('board').innerHTML = '';
  document.getElementById('phraseInput').value = '';
}

/* =========================
   EXPOR FUNÇÕES
========================= */

window.generateBoard = generateBoard;
window.renderBoard = renderBoard;
window.applyBoardConfig = applyBoardConfig;
window.clearBoard = clearBoard;

