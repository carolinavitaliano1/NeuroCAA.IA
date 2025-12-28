/* =========================
   MODAL DE EDIÇÃO DO PICTOGRAMA
========================= */

const pictogramCache = {};

function openQuickEditModal(index) {
  const item = window.currentBoard[index];
  if (!item) return;

  let colorTarget = null; // 'bg' ou 'border'

  /* ---------- Overlay ---------- */
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

  /* ---------- Modal ---------- */
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

    <label>Texto da célula</label>
    <input id="editText"
      value="${item.customText || item.word}"
      style="width:100%; padding:8px; margin-bottom:10px"/>

    <strong>🖼️ Escolha um pictograma</strong>
    <div id="imageGrid"
      style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0">
      <div style="grid-column:1/-1;text-align:center">⏳ Carregando...</div>
    </div>

    <div style="display:flex;gap:6px;margin-bottom:12px">
      <input id="searchWord"
        placeholder="Buscar outra palavra"
        style="flex:1;padding:8px"/>
      <button id="searchBtn">🔍</button>
    </div>

    <label>📁 Anexar imagem do computador</label>
    <input type="file" id="uploadImg" accept="image/*"
      style="margin-bottom:12px"/>

    <strong>🎨 Cores semânticas (CAA)</strong>

    <div style="display:flex;gap:6px;margin:8px 0">
      <button id="btnBg" style="flex:1">Fundo da célula</button>
      <button id="btnBorder" style="flex:1">Borda da célula</button>
    </div>

    <div id="colorGrid"
      style="display:none;gap:6px;flex-direction:column;margin-bottom:12px">
    </div>

    <div style="display:flex;justify-content:flex-end;gap:10px">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  /* =========================
     FUNÇÕES DE IMAGEM
  ========================= */

  const grid = modal.querySelector('#imageGrid');

  async function loadImages(word) {
    grid.innerHTML =
      `<div style="grid-column:1/-1;text-align:center">⏳ Carregando...</div>`;

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
        `<div style="grid-column:1/-1;color:red;text-align:center">
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
      `;
      img.onclick = () => {
        item.img = img.src;
        window.renderBoard();
        overlay.remove();
      };
      grid.appendChild(img);
    });
  }

  loadImages(item.word);

  modal.querySelector('#searchBtn').onclick = () => {
    const w = modal.querySelector('#searchWord').value.trim();
    if (w) loadImages(w);
  };

  /* =========================
     UPLOAD DE IMAGEM
  ========================= */

  modal.querySelector('#uploadImg').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      item.img = ev.target.result;
      window.renderBoard();
      overlay.remove();
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     CORES CAA POR CÉLULA
  ========================= */

  const colorGrid = modal.querySelector('#colorGrid');

  function showColors(target) {
    colorTarget = target;
    colorGrid.innerHTML = '';
    colorGrid.style.display = 'flex';

    CAA_COLORS.forEach(c => {
      const btn = document.createElement('button');
      btn.textContent = `${c.name} – ${c.label}`;
      btn.style.cssText = `
        background:${c.color};
        padding:6px;
        border-radius:6px;
        border:1px solid #333;
        cursor:pointer;
        text-align:left;
      `;
      btn.onclick = () => {
        if (colorTarget === 'bg') item.bgColor = c.color;
        if (colorTarget === 'border') item.borderColor = c.color;
        window.renderBoard();
      };
      colorGrid.appendChild(btn);
    });
  }

  modal.querySelector('#btnBg').onclick = () => showColors('bg');
  modal.querySelector('#btnBorder').onclick = () => showColors('border');

  /* =========================
     SALVAR / FECHAR
  ========================= */

  modal.querySelector('#save').onclick = () => {
    item.customText =
      modal.querySelector('#editText').value.trim();
    window.renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}

window.openQuickEditModal = openQuickEditModal;

