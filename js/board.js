
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
   INICIALIZA
========================= */

document.addEventListener("DOMContentLoaded", () => {
  populateCAASelects();
});

/* =========================
   CORES CAA
========================= */

function populateCAASelects() {
  const selects = [
    "headerColor",
    "cellBgColor",
    "cellBorderColor",
    "boardBorderColor"
  ];

  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">Selecione…</option>`;

    CAA_COLORS.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.color;

      if (id === "headerColor" || id === "boardBorderColor") {
        opt.textContent = c.name;
      } else {
        opt.textContent = `${c.name} – ${c.label}`;
      }

      select.appendChild(opt);
    });
  });
}

/* =========================
   GERAR PRANCHA (COM GERANDO…)
========================= */

async function generateBoard() {
  const btn = document.querySelector(".generate");
  btn.innerText = "Gerando...";
  btn.disabled = true;

  const phrase = document.getElementById("phraseInput").value.trim();
  if (!phrase) {
    btn.innerText = "Gerar";
    btn.disabled = false;
    return;
  }

  window.currentBoard = [];
  const words = phrase.split(/\s+/);

  for (const word of words) {
    let data = [];
    try {
      const res = await fetch(API + encodeURIComponent(word));
      data = await res.json();
    } catch {}

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

  btn.innerText = "Gerar";
  btn.disabled = false;
}

/* =========================
   RENDER PRANCHA
========================= */

function renderBoard() {
  const board = document.getElementById("board");
  if (!board) return;

  board.innerHTML = "";

  if (boardConfig.columnsCount) {
    board.style.gridTemplateColumns =
      `repeat(${boardConfig.columnsCount}, 1fr)`;
  }

  if (boardConfig.cellGap !== null) {
    board.style.gap = `${boardConfig.cellGap}px`;
  }

  if (boardConfig.boardBorderColor) {
    board.style.border = `4px solid ${boardConfig.boardBorderColor}`;
    board.style.padding = "10px";
    board.style.borderRadius = "12px";
  }

  const title = document.getElementById("boardTitle")?.value.trim();
  const header = document.createElement("div");
  header.style.gridColumn = "1 / -1";
  header.style.textAlign = "center";

  if (title) {
    header.innerText = title;
    header.style.fontWeight = "800";
    header.style.fontSize = "32px";
    header.style.padding = "16px";
    if (boardConfig.headerColor) {
      header.style.background = boardConfig.headerColor;
      header.style.borderRadius = "12px";
    }
  } else {
    header.style.height = "16px";
  }

  board.appendChild(header);

  window.currentBoard.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.style.background =
      item.bgColor || boardConfig.cellBgColor || "#fff";
    cell.style.border =
      `2px solid ${item.borderColor || boardConfig.cellBorderColor || "#e2e8f0"}`;

    cell.innerHTML = `
      <div class="remove-btn">×</div>
      ${item.img ? `<img src="${item.img}">` : ""}
      <div>${item.customText || item.word}</div>
    `;

    cell.querySelector(".remove-btn").onclick = e => {
      e.stopPropagation();
      window.currentBoard.splice(index, 1);
      renderBoard();
    };

    cell.onclick = () => {
      if (typeof openQuickEditModal === "function") {
        openQuickEditModal(index);
      }
    };

    board.appendChild(cell);
  });
}

/* =========================
   CONFIGURAÇÕES
========================= */

function applyBoardConfig() {
  boardConfig.headerColor =
    document.getElementById("headerColor")?.value || null;

  boardConfig.cellBgColor =
    document.getElementById("cellBgColor")?.value || null;

  boardConfig.cellBorderColor =
    document.getElementById("cellBorderColor")?.value || null;

  boardConfig.boardBorderColor =
    document.getElementById("boardBorderColor")?.value || null;

  boardConfig.columnsCount =
    Number(document.getElementById("columnsCount")?.value) || null;

  boardConfig.cellGap =
    Number(document.getElementById("cellGap")?.value) || null;

  renderBoard();
}

/* =========================
   LIMPAR
========================= */

function clearBoard() {
  window.currentBoard = [];
  document.getElementById("board").innerHTML = "";
  document.getElementById("phraseInput").value = "";
}

/* =========================
   EXPORTS
========================= */

window.generateBoard = generateBoard;
window.renderBoard = renderBoard;
window.applyBoardConfig = applyBoardConfig;
window.clearBoard = clearBoard;
