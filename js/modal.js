const pictogramCache = {};

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

    <strong>🔍 Buscar outro pictograma</strong>
    <div style="display:flex; gap:6px; margin:6px 0 10px">
      <input id="searchWord" placeholder="Digite outra palavra"
        style="flex:1; padding:8px"/>
      <button id="searchBtn">🔍</button>
    </div>

    <strong>📁 Anexar imagem do dispositivo</strong>
    <input type="file" id="uploadImg" accept="image/*"
      style="width:100%; margin:8px 0 15px"/>

    <div style="display:flex; gap:10px; justify-content:flex-end">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const grid = modal.querySelector('#imageGrid');

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
      grid.innerHTML = `<div style="grid-column:1/-1; color:red">Erro ao carregar imagens</div>`;
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
        renderBoard();
        overlay.remove();
      };
      grid.appendChild(img);
    });
  }

  // 🔥 carrega imagens da palavra original
  loadImages(item.word);

  // 🔍 busca manual
  modal.querySelector('#searchBtn').onclick = () => {
    const w = modal.querySelector('#searchWord').value.trim();
    if (w) loadImages(w);
  };

  // 📁 upload local — AGORA FUNCIONA
  modal.querySelector('#uploadImg').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      item.img = ev.target.result;
      renderBoard();
      overlay.remove();
    };
    reader.readAsDataURL(file);
  };

  modal.querySelector('#save').onclick = () => {
    item.customText = modal.querySelector('#editText').value.trim();
    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}

window.openQuickEditModal = openQuickEditModal;
