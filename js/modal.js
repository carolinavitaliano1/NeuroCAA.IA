/* =========================
   MODAL DE EDIÇÃO DO PICTOGRAMA
========================= */

const pictogramCache = {};

function openQuickEditModal(index) {
  const item = currentBoard[index];

  let tempImg = item.img; // 🔑 imagem temporária

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

    <strong>Ou busque outro pictograma</strong>
    <div style="display:flex; gap:6px; margin:6px 0 12px">
      <input id="searchWord" placeholder="Digite outra palavra"
        style="flex:1; padding:8px"/>
      <button id="searchBtn">🔍</button>
    </div>

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

    try {
      const res = await fetch(API + encodeURIComponent(word));
      const data = await res.json();
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
        border:${tempImg === img.src ? '3px solid #22c55e' : '2px solid transparent'};
      `;

      img.onclick = () => {
        tempImg = img.src;   // ✅ só seleciona
        renderImages(data);  // 🔄 atualiza destaque
      };

      grid.appendChild(img);
    });
  }

  // 🔥 busca inicial
  loadImages(item.word);

  modal.querySelector('#searchBtn').onclick = () => {
    const w = modal.querySelector('#searchWord').value.trim();
    if (w) loadImages(w);
  };

  // 💾 SALVAR DE VERDADE
  modal.querySelector('#save').onclick = () => {
    item.customText = modal.querySelector('#editText').value.trim();
    item.img = tempImg;
    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}

window.openQuickEditModal = openQuickEditModal;

