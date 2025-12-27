function openQuickEditModal(index) {
  const item = currentBoard[index];
  let target = null;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.6);
    display:flex; align-items:center; justify-content:center; z-index:9999;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background:#fff; padding:20px; border-radius:12px; max-width:420px; width:100%;
  `;

  modal.innerHTML = `
    <h3>✏️ Editar "${item.word}"</h3>

    <input id="editText" value="${item.customText || item.word}" />

    <button id="bgBtn">🎨 Fundo (CAA)</button>
    <button id="borderBtn">🖍️ Borda (CAA)</button>

    <div id="colorPanel" style="display:none"></div>

    <div style="margin-top:10px">
      🔍 <input id="searchWord" placeholder="Buscar outro pictograma"/>
      <button id="searchPic">Buscar</button>
    </div>

    <input type="file" id="uploadImg"/>

    <div class="actions">
      <button id="save">💾 Salvar</button>
      <button id="close">❌ Fechar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const panel = modal.querySelector('#colorPanel');

  function showColors(type) {
    target = type;
    panel.innerHTML = '';
    panel.style.display = 'block';

    CAA_COLORS.forEach(c => {
      const b = document.createElement('button');
      b.textContent = `${c.name} – ${c.label}`;
      b.style.background = c.color;
      b.onclick = () => {
        if (target === 'bg') item.bgColor = c.color;
        if (target === 'border') item.borderColor = c.color;
        renderBoard();
      };
      panel.appendChild(b);
    });
  }

  modal.querySelector('#bgBtn').onclick = () => showColors('bg');
  modal.querySelector('#borderBtn').onclick = () => showColors('border');

  modal.querySelector('#searchPic').onclick = async () => {
    const term = modal.querySelector('#searchWord').value || item.word;
    const res = await fetch(API + encodeURIComponent(term));
    const data = await res.json();

    panel.innerHTML = '';
    data.slice(0,9).forEach(p => {
      const img = document.createElement('img');
      img.src = `https://static.arasaac.org/pictograms/${p._id}/${p._id}_300.png`;
      img.style.width = '80px';
      img.onclick = () => {
        item.img = img.src;
        renderBoard();
        overlay.remove();
      };
      panel.appendChild(img);
    });
  };

  modal.querySelector('#uploadImg').onchange = e => {
    const r = new FileReader();
    r.onload = ev => {
      item.img = ev.target.result;
      renderBoard();
      overlay.remove();
    };
    r.readAsDataURL(e.target.files[0]);
  };

  modal.querySelector('#save').onclick = () => {
    item.customText = modal.querySelector('#editText').value;
    renderBoard();
    overlay.remove();
  };

  modal.querySelector('#close').onclick = () => overlay.remove();
}
  window.openQuickEditModal = openQuickEditModal;
