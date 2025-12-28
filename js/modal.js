/* =========================
   CACHE DE PICTOGRAMAS
========================= */
const pictogramCache = {};

/* =========================
   MODAL DE EDIÇÃO RÁPIDA
========================= */
function openQuickEditModal(index) {
  const item = window.currentBoard[index];

  /* OVERLAY */
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

  /* MODAL */
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
    <h3 style="margin-top:0">✏️ Editar "${item.word}"</h3>

    <label>Texto da palavra</label>
    <input
      id="editText"
      value="${item.customText || item.word}"
      style="width:100%; padding:8px; margin-bottom:12px"
    />

    <div style="background:#ecfdf5; padding:8px; border-radius:6px; margin-bottom:10px">
      💡 Clique em uma imagem para selecionar (não fecha o modal)
    </div>

    <div id="imageGrid" style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
      margin-bottom:16px;
    ">
      <div style="grid-column:1/-1; text-align:center">⏳ Carregando imagens…</div>
    </div>

    <strong>🔍 Buscar outro pictograma</strong>
    <div style="display:flex; gap:6px; margin:6px 0 14px">
      <input id="searchWord" placeholder="Digite outra palavra" style="flex:1; padding:8px"/>
      <button id="searchBtn">🔎</button>
    </div>

    <hr>

    <strong>📎 Anexar imagem do computador</strong>
    <input
      type="file"
      id="uploadImg"
      accept="image/*"
      style="margin:8px 0 14px"
    />

    <hr>

    <strong>🎨 Cores da célula (individual)</strong>

    <label>Cor de fundo (CAA)</label>
    <select id="cellBgColorSelect" style="width:100%; margin-bottom:8px">
      <option value="">Padrão da prancha</option>
    </select>

    <label>Cor da borda (CAA)</label>
    <select id="cellBorderColorSelect" style="width:100%; margin-bottom:14px">
      <option value="">Padrão da prancha</option>
    </select>

    <div style="display:flex; justify-content:flex-end; gap:10px">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  /* =========================
     GRID DE IMAGENS
  ========================= */
  const grid = modal.querySelector('#imageGrid');

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
        // 🔥 NÃO FECHA O MODAL
        item.img = img.src;
        renderBoard();
      };

      grid.appendChild(img);
    });
  }

  async function loadImages(word) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center">⏳ Carregando imagens…</div>`;

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

  // busca automática ao abrir
  loadImages(item.word);

  modal.querySelector('#searchBtn').onclick = () => {
    const w = modal.querySelector('#searchWord').value.trim();
    if (w) loadImages(w);
  };

  /* =========================
     UPLOAD DE IMAGEM LOCAL
  ========================= */
  modal.querySelector('#uploadImg').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      item.img = reader.result;
      renderBoard();
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     CORES INDIVIDUAIS (CAA)
  ========================= */
  const bgSelect = modal.querySelector('#cellBgColorSelect');
  const borderSelect = modal.querySelector('#cellBorderColorSelect');

  CAA_COLORS.forEach(c => {
    const opt1 = document.createElement('option');
    opt1.value = c.color;
    opt1.textContent = `${c.name} – ${c.label}`;
    bgSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = c.color;
    opt2.textContent = `${c.name} – ${c.label}`;
    borderSelect.appendChild(opt2);
  });

  bgSelect.value = item.bgColor || '';
  borderSelect.value = item.borderColor || '';

  /* =========================
     SALVAR / FECHAR
  ========================= */
  modal.querySelector('#save').onclick = () => {
    item.customText = modal.querySelector('#editText').value.trim();
    item.bgColor = bgSelect.value || null;
    item.borderColor = borderSelect.value || null;
    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}

/* =========================
   EXPOR FUNÇÃO
========================= */
window.openQuickEditModal = openQuickEditModal;


