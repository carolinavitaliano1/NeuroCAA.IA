const pictogramCache = {};

/* =========================
   MODAL DE EDIÇÃO DA CÉLULA
========================= */

function openQuickEditModal(index) {
  const item = window.currentBoard[index];

  let colorTarget = null; // "bg" | "border"

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.6);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background:#fff;
    padding:20px;
    border-radius:12px;
    max-width:440px;
    width:100%;
    max-height:90vh;
    overflow:auto;
  `;

  modal.innerHTML = `
    <h3>✏️ Editar "${item.word}"</h3>

    <label>Texto da célula:</label>
    <input id="editText"
      value="${item.customText || item.word}"
      style="width:100%; padding:8px; margin-bottom:10px"/>

    <label>🎨 Fundo da célula:</label>
    <button id="btnBg" style="width:100%; padding:8px; margin-bottom:6px">
      Escolher cor CAA
    </button>

    <label>🖍️ Borda da célula:</label>
    <button id="btnBorder" style="width:100%; padding:8px; margin-bottom:10px">
      Escolher cor CAA
    </button>

    <div id="colorPanel"
      style="display:none; margin-bottom:12px"></div>

    <hr>

    <div style="background:#f1f5f9; padding:8px; border-radius:6px; margin-bottom:10px">
      💡 Clique em uma imagem para substituir o pictograma
    </div>

    <div id="imageGrid"
      style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:12px">
      <div style="grid-column:1/-1; text-align:center">⏳ Carregando imagens…</div>
    </div>

    <strong>Buscar outro pictograma</strong>
    <div style="display:flex; gap:6px; margin:6px 0 14px">
      <input id="searchWord" placeholder="Digite outra palavra"
        style="flex:1; padding:8px"/>
      <button id="searchBtn">🔍</button>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:10px">
      <button id="saveBtn">💾 Salvar</button>
      <button id="closeBtn">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  /* =========================
     PAINEL DE CORES CAA
  ========================= */

  const colorPanel = modal.querySelector('#colorPanel');

  function openColorPanel(target) {
    colorTarget = target;
    colorPanel.innerHTML = '';
    colorPanel.style.display = 'grid';
    colorPanel.style.gridTemplateColumns = '1fr';
    colorPanel.style.gap = '6px';

    CAA_COLORS.forEach(c => {
      const btn = document.createElement('button');
      btn.textContent = `${c.name} – ${c.label}`;
      btn.style.cssText = `
        background:${c.color};
        border:2px solid #333;
        padding:6px;
        border-radius:6px;
        cursor:pointer;
        text-align:left;
      `;

      btn.onclick = () => {
        if (colorTarget === 'bg') {
          item.bgColor = c.color;
        }
        if (colorTarget === 'border') {
          item.borderColor = c.color;
        }
        renderBoard();
        colorPanel.style.display = 'none';
      };

      colorPanel.appendChild(btn);
    });
  }

  modal.querySelector('#btnBg').onclick = () => openColorPanel('bg');
  modal.querySelector('#btnBorder').onclick = () => openColorPanel('border');

  /* =========================
     IMAGENS (ARASAAC)
  ========================= */

  const grid = modal.querySelector('#imageGrid');

  async function loadImages(word) {
    grid.innerHTML =
      `<div style="grid-column:1/-1; text-align:center">⏳ Carregando imagens…</div>`;

    if (pictogramCache[word]) {
      renderImages(pictogramCache[word]);
      return;
    }

    try {
      const res = await fetch(API + encodeURIComponent(word));
      const data = await res.json();
      pictogramCache[word] = data;
      renderImages(data);
    } catch {
      grid.innerHTML =
        `<div style="grid-column:1/-1; text-align:center; color:red">
          Erro ao carregar imagens
        </div>`;
    }
  }

  function renderImages(data) {
    grid.innerHTML = '';
    data.slice(0, 9).forEach(p => {
      const img = document.createElement('img');
      img.src = `https://static.arasaac.org/pictograms/${p._id}/${p._id}_300.png`;
      img.style.cssText = `
        width:100%;
        border-radius:8px;
        cursor:pointer;
        border:2px solid transparent;
      `;
      img.onclick = () => {
        item.img = img.src;
        renderBoard();
        overlay.remove();
      };
      grid.appendChild(img);
    });
  }

  // busca inicial
  loadImages(item.word);

  modal.querySelector('#searchBtn').onclick = () => {
    const w = modal.querySelector('#searchWord').value.trim();
    if (w) loadImages(w);
  };

  /* =========================
     SALVAR / FECHAR
  ========================= */

  modal.querySelector('#saveBtn').onclick = () => {
    item.customText =
      modal.querySelector('#editText').value.trim();
    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#closeBtn').onclick = () => overlay.remove();
}

/* =========================
   EXPORTA GLOBALMENTE
========================= */

window.openQuickEditModal = openQuickEditModal;

