/* =========================
   CACHE DE PICTOGRAMAS
========================= */
const pictogramCache = {};

/* =========================
   MODAL DE EDIÇÃO DA CÉLULA
========================= */
function openQuickEditModal(index) {
  const item = window.currentBoard[index];

  /* ===== ESTADO TEMPORÁRIO ===== */
  let tempImage = item.img;
  let tempBgColor = item.bgColor;
  let tempBorderColor = item.borderColor;
  let tempText = item.customText || item.word;

  /* ===== OVERLAY ===== */
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

  /* ===== MODAL ===== */
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
    <h3>✏️ Editar pictograma</h3>

    <label>Texto da célula</label>
    <input id="editText" value="${tempText}"
      style="width:100%; padding:8px; margin-bottom:10px"/>

    <!-- PREVIEW -->
    <div id="preview" style="
      border:2px dashed #cbd5f5;
      border-radius:10px;
      padding:10px;
      text-align:center;
      margin-bottom:12px;
    ">
      ${tempImage ? `<img src="${tempImage}" style="max-width:140px"/>` : 'Sem imagem'}
    </div>

    <!-- 📎 ANEXAR IMAGEM -->
    <label>📎 Anexar imagem do computador</label>
    <input type="file" id="uploadImage" accept="image/*"
      style="width:100%; margin-bottom:14px"/>

    <hr>

    <!-- ARASAAC -->
    <strong>🔄 Escolher pictograma (ARASAAC)</strong>

    <div id="imageGrid" style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
      margin:10px 0;
    ">
      <div style="grid-column:1/-1;text-align:center">⏳ Carregando...</div>
    </div>

    <label>Buscar outro pictograma</label>
    <div style="display:flex; gap:6px; margin-bottom:12px">
      <input id="searchWord" placeholder="Digite outra palavra"
        style="flex:1; padding:8px"/>
      <button id="searchBtn">🔍</button>
    </div>

    <hr>

    <!-- CORES INDIVIDUAIS -->
    <strong>🎨 Cores da célula (individual)</strong>

    <label>Cor de fundo (CAA)</label>
    <select id="bgColorSelect" style="width:100%; margin-bottom:8px"></select>

    <label>Cor da borda (CAA)</label>
    <select id="borderColorSelect" style="width:100%; margin-bottom:14px"></select>

    <div style="display:flex; gap:10px; justify-content:flex-end">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  /* =========================
     PREVIEW
  ========================= */
  const preview = modal.querySelector('#preview');

  function updatePreview() {
    preview.innerHTML = tempImage
      ? `<img src="${tempImage}" style="max-width:140px"/>`
      : 'Sem imagem';
  }

  /* =========================
     UPLOAD DE IMAGEM
  ========================= */
  modal.querySelector('#uploadImage').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      tempImage = reader.result; // base64
      updatePreview();
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     SELECTS DE CORES
  ========================= */
  const bgSelect = modal.querySelector('#bgColorSelect');
  const borderSelect = modal.querySelector('#borderColorSelect');

  bgSelect.innerHTML = `<option value="">Padrão da prancha</option>`;
  borderSelect.innerHTML = `<option value="">Padrão da prancha</option>`;

  CAA_COLORS.forEach(c => {
    const o1 = document.createElement('option');
    o1.value = c.color;
    o1.textContent = `${c.name} – ${c.label}`;
    bgSelect.appendChild(o1);

    const o2 = document.createElement('option');
    o2.value = c.color;
    o2.textContent = `${c.name} – ${c.label}`;
    borderSelect.appendChild(o2);
  });

  bgSelect.value = tempBgColor || '';
  borderSelect.value = tempBorderColor || '';

  bgSelect.onchange = () => tempBgColor = bgSelect.value || null;
  borderSelect.onchange = () => tempBorderColor = borderSelect.value || null;

  /* =========================
     BUSCA ARASAAC
  ========================= */
  const grid = modal.querySelector('#imageGrid');

  async function loadImages(word) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center">⏳ Carregando...</div>`;

    if (!pictogramCache[word]) {
      const res = await fetch(API + encodeURIComponent(word));
      pictogramCache[word] = await res.json();
    }

    grid.innerHTML = '';
    pictogramCache[word].slice(0, 9).forEach(p => {
      const img = document.createElement('img');
      img.src = `https://static.arasaac.org/pictograms/${p._id}/${p._id}_300.png`;
      img.style.cssText = `
        width:100%;
        border-radius:8px;
        cursor:pointer;
        border:2px solid transparent;
      `;

      img.onclick = () => {
        tempImage = img.src;
        updatePreview();
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
     SALVAR / FECHAR
  ========================= */
  modal.querySelector('#save').onclick = () => {
    item.img = tempImage;
    item.bgColor = tempBgColor;
    item.borderColor = tempBorderColor;
    item.customText = modal.querySelector('#editText').value.trim();

    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => {
    overlay.remove();
  };
}

/* expor global */
window.openQuickEditModal = openQuickEditModal;

