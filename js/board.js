/* =========================
   ESTADO GLOBAL DA PRANCHA
========================= */

let currentBoard = [];
let boardConfig = {
  headerColor: null,
  cellBgColor: null,
  cellBorderColor: null,
  boardBorderColor: null
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
      opt.textContent = `${c.name} – ${c.label}`;
      select.appendChild(opt);
    });
  });
}

/* =========================
   GERAR PRANCHA
========================= */

async function generateBoard() {
  const phrase = document.getElementById('phraseInput').value.trim();
  if (!phrase) return;

  currentBoard = [];
  const words = phrase.split(/\s+/);

  for (const word of words) {
    let data = [];
    try {
      const res = await fetch(API + encodeURIComponent(word));
      data = await res.json();
    } catch (e) {
      console.warn('Erro ao buscar pictograma:', word);
    }

    const pic = data[0];

    currentBoard.push({
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
}

/* =========================
   RENDERIZAR PRANCHA
========================= */

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // aplica borda da prancha
  if (boardConfig.boardBorderColor) {
    board.style.border = `4px solid ${boardConfig.boardBorderColor}`;
    board.style.borderRadius = '12px';
    board.style.padding = '10px';
  }

  // título
  const title = document.getElementById('boardTitle').value.trim();
  if (title) {
    const titleDiv = document.createElement('div');
    titleDiv.textContent = title;
    titleDiv.style.gridColumn = '1 / -1';
    titleDiv.style.textAlign = 'center';
    titleDiv.style.fontWeight = '700';
    titleDiv.style.padding = '8px';
    titleDiv.style.marginBottom = '10px';

    if (boardConfig.headerColor) {
      titleDiv.style.background = boardConfig.headerColor;
      titleDiv.style.borderRadius = '8px';
    }

    board.appendChild(titleDiv);
  }

  // células
  currentBoard.forEach((item, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const bg =
      item.bgColor ||
      boardConfig.cellBgColor ||
      '#ffffff';

    const border =
      item.borderColor ||
      boardConfig.cellBorderColor ||
      '#e2e8f0';

    cell.style.background = bg;
    cell.style.border = `2px solid ${border}`;

    cell.innerHTML = `
  <div class="remove-btn" title="Remover pictograma">×</div>
  ${item.img ? `<img src="${item.img}" alt="${item.word}">` : ''}
  <div>${item.customText || item.word}</div>
`;

// ❌ Remover pictograma
cell.querySelector('.remove-btn').onclick = (e) => {
  e.stopPropagation(); // impede abrir o modal
  currentBoard.splice(index, 1);
  renderBoard();
};

    cell.onclick = () => {
      if (typeof openQuickEditModal === 'function') {
        openQuickEditModal(index);
      }
    };

    board.appendChild(cell);
  });
}

/* =========================
   APLICAR CONFIGURAÇÕES DA PRANCHA
========================= */

function applyBoardConfig() {
  boardConfig.headerColor =
    document.getElementById('headerColor').value || null;

  boardConfig.cellBgColor =
    document.getElementById('cellBgColor').value || null;

  boardConfig.cellBorderColor =
    document.getElementById('cellBorderColor').value || null;

  boardConfig.boardBorderColor =
    document.getElementById('boardBorderColor').value || null;

  renderBoard();
}

/* =========================
   LIMPAR PRANCHA
========================= */

function clearBoard() {
  currentBoard = [];
  document.getElementById('board').innerHTML = '';
  document.getElementById('phraseInput').value = '';
}

/* =========================
   EXPOR FUNÇÕES GLOBAIS
========================= */

window.generateBoard = generateBoard;
window.renderBoard = renderBoard;
window.applyBoardConfig = applyBoardConfig;
window.clearBoard = clearBoard;
