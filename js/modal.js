/* =========================
   CACHE DE PICTOGRAMAS
========================= */
const pictogramCache = {};

/* =========================
   MODAL DE EDIÇÃO RÁPIDA
========================= */
function openQuickEditModal(index) {
  const item = window.currentBoard[index];

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
    max-width:460px;
    width:100%;
    max-height:90vh;
    overflow:auto;
  `;

  modal.innerHTML = `
    <h3>✏️ Editar "${item.word}"</h3>

    <label>Texto da palavra</label>
    <input id="editText" value="${item.customText || item.word}"
      style="width:100%; padding:8px; margin-bottom:10px"/>

    <div style="background:#ecfdf5; padding:8px; border-radius:6px; margin-bottom:10px">
      💡 Clique em uma imagem para selecionar (salve para aplicar)
    </div>

    <div id="imageGrid" style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
      margin-bottom:15px;
    ">
      <div style="grid-column:1/-1; text-align:center">⏳ Carregando imagens...</div>
    </div>

    <strong>🔍 Buscar outro pictograma</strong>
    <div style="display:flex; gap:6px; margin:6px 0 12px">
      <input id="searchWord" placeholder="Digite outra palavra"
        style="flex:1; padding:8px"/>
      <button id="searchBtn">🔍</button>
    </div>

    <hr style="margin:15px 0">

    <strong>🎨 Cores da célula (individual)</strong>

    <label>Cor de fundo (CAA)</label>
    <select id="cellBgColorModal" style="width:100%; margin-bottom:10px">
      <option value="">Padrão da prancha</option>
    </select>

    <label>Cor da borda (CAA)</label>
    <select id="cellBorderColorModal" style="width:100%; margin-bottom:15px">
      <option value="">Padrão da prancha</option>
    </select>

    <div style="display:flex; gap:10px; justify-content:flex-end">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  /* =========================
     POPULAR SELECTS CAA (MODAL)
  ========================= */
  const bgSelect = modal.querySelector('#cellBgColorModal');
  const borderSelect = modal.querySelector('#cellBorderColorModal');

  CAA_COLORS.forEach(c => {
    const optBg = document.createElement('option');
    optBg.value = c.color;
    optBg.textContent = `${c.name} – ${c.label}`;
    if (item.bgColor === c.color) optBg.selected = true;
    bgSelect.appendChild(optBg);

    const optBorder = document.createElement('option');
    optBorder.value = c.color;
    optBorder.textContent = `${c.name} – ${c.label}`;
    if (item.borderColor === c.color) optBorder.selected = true;
    borderSelect.appendChild(optBorder);
  });

  /* =========================
     IMAGENS ARASAAC
  ========================= */
  const grid = modal.querySelector('#imageGrid');
  let selectedImage = item.img || null;

  async function loadImages(word) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center">⏳ Carregando imagens...</div>`;

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
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center;color:red">
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
        border:${selectedImage === img.src ? '3px solid #2563eb' : '2px solid transparent'};
      `;
      img.onclick = () => {
        selectedImage = img.src;
        renderImages(data); // apenas marca seleção
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
     SALVAR ALTERAÇÕES
  ========================= */
  modal.querySelector('#save').onclick = () => {
    item.customText = modal.querySelector('#editText').value.trim();
    item.img = selectedImage;

    item.bgColor = bgSelect.value || null;
    item.borderColor = borderSelect.value || null;

    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}

window.openQuickEditModal = openQuickEditModal;
