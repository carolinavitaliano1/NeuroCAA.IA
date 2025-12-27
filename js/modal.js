function openQuickEditModal(index) {
  const item = currentBoard[index];

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
    max-width:420px;
    width:100%;
    max-height:90vh;
    overflow:auto;
  `;

  modal.innerHTML = `
    <h3>✏️ Editar "${item.word}"</h3>

    <label>Texto da palavra:</label>
    <input id="editText" value="${item.customText || item.word}"
      style="width:100%; padding:8px; margin-bottom:10px"/>

    <div style="background:#ecfdf5; padding:8px; border-radius:6px; margin-bottom:10px">
      💡 Clique em uma imagem para substituir a atual
    </div>

    <div id="imageGrid" style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
      margin-bottom:15px;
    "></div>

    <div style="margin-bottom:10px">
      <strong>Ou busque outro pictograma</strong>
      <div style="display:flex; gap:6px; margin-top:6px">
        <input id="searchWord" placeholder="Digite outra palavra"
          style="flex:1; padding:8px"/>
        <button id="searchBtn">🔍</button>
      </div>
    </div>

    <label>🎨 Fundo:</label>
    <button id="btnBg" style="width:100%; padding:8px; margin-bottom:6px">
      Selecionar cor semântica
    </button>

    <label>🖍️ Borda:</label>
    <button id="btnBorder" style="width:100%; padding:8px; margin-bottom:10px">
      Selecionar cor semântica
    </button>

    <div id="colorPanel" style="display:none; margin-bottom:10px"></div>

    <input type="file" id="uploadImg" accept="image/*" style="margin-bottom:10px"/>

    <div style="display:flex; gap:10px; justify-content:flex-end">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const grid = modal.querySelector('#imageGrid');

  async function loadImages(word) {
    grid.innerHTML = '⏳ Carregando...';
    const res = await fetch(API + encodeURIComponent(word));
    const data = await res.json();
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

  // carrega automaticamente ao abrir
  loadImages(item.word);

  modal.querySelector('#searchBtn').onclick = () => {
    const w = modal.querySelector('#searchWord').value.trim();
    if (w) loadImages(w);
  };

  modal.querySelector('#uploadImg').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      item.img = ev.target.result;
      renderBoard();
      overlay.remove();
    };
    r.readAsDataURL(file);
  };

  modal.querySelector('#save').onclick = () => {
    item.customText = modal.querySelector('#editText').value.trim();
    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}

// deixa acessível ao board.js
window.openQuickEditModal = openQuickEditModal;
