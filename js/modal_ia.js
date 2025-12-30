const iaPictogramCache = {};

function openIAModal(cell) {
  const originalImg = cell.querySelector('img')?.src || null;
  const originalText = cell.querySelector('.cell-text')?.innerText || '';
  const originalBg = cell.style.background || '';
  const originalBorder = cell.style.borderColor || '';

  let tempImg = originalImg;
  let tempText = originalText;
  let tempBg = originalBg;
  let tempBorder = originalBorder;

  /* =========================
     OVERLAY
  ========================= */
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

  /* =========================
     MODAL
  ========================= */
  const modal = document.createElement('div');
  modal.style.cssText = `
    background:#fff;
    padding:20px;
    border-radius:14px;
    width:100%;
    max-width:420px;
    max-height:90vh;
    overflow:auto;
  `;

  modal.innerHTML = `
    <h3 style="margin-bottom:10px">✏️ Editar célula</h3>

    <label>Texto</label>
    <input id="iaText" value="${originalText}"
      style="width:100%; padding:8px; margin-bottom:10px"/>

    <strong>Imagens (ARASAAC)</strong>
    <div id="iaImageGrid"
      style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:10px 0">
      <div style="grid-column:1/-1; text-align:center">🔎 Buscando imagens…</div>
    </div>

    <div style="display:flex; gap:6px; margin-bottom:10px">
      <input id="iaSearch" placeholder="Buscar outra palavra"
        style="flex:1; padding:8px"/>
      <button id="iaSearchBtn">🔍</button>
    </div>

    <label>Anexar imagem</label>
    <input type="file" id="iaUpload" accept="image/*"
      style="margin-bottom:10px"/>

    <label>Cor de fundo</label>
    <input type="color" id="iaBg" value="${rgbToHex(originalBg)}"
      style="width:100%; margin-bottom:10px"/>

    <label>Cor da borda</label>
    <input type="color" id="iaBorder" value="${rgbToHex(originalBorder)}"
      style="width:100%; margin-bottom:14px"/>

    <div style="display:flex; gap:10px; justify-content:flex-end">
      <button id="iaSave">💾 Salvar</button>
      <button id="iaCancel">❌ Cancelar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const grid = modal.querySelector('#iaImageGrid');

  /* =========================
     BUSCA ARASAAC
  ========================= */
  async function loadIAImages(word) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center">🔎 Buscando imagens…</div>`;

    if (iaPictogramCache[word]) {
      renderIAImages(iaPictogramCache[word]);
      return;
    }

    try {
      const res = await fetch(API + encodeURIComponent(word));
      const data = await res.json();
      iaPictogramCache[word] = data;
      renderIAImages(data);
    } catch {
      grid.innerHTML = `<div style="grid-column:1/-1; color:red">Erro ao carregar imagens</div>`;
    }
  }

  function renderIAImages(data) {
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
        tempImg = img.src;
        grid.querySelectorAll('img').forEach(i => i.style.border = '2px solid transparent');
        img.style.border = '2px solid #2563eb';
      };
      grid.appendChild(img);
    });
  }

  /* 🔥 Busca inicial automática */
  loadIAImages(originalText || 'ação');

  modal.querySelector('#iaSearchBtn').onclick = () => {
    const w = modal.querySelector('#iaSearch').value.trim();
    if (w) loadIAImages(w);
  };

  /* =========================
     UPLOAD LOCAL
  ========================= */
  modal.querySelector('#iaUpload').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => tempImg = reader.result;
    reader.readAsDataURL(file);
  };

  /* =========================
     SALVAR
  ========================= */
  modal.querySelector('#iaSave').onclick = () => {
    if (tempImg) {
      let img = cell.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        cell.prepend(img);
      }
      img.src = tempImg;
    }

    cell.querySelector('.cell-text').innerText =
      modal.querySelector('#iaText').value.trim();

    cell.style.background = modal.querySelector('#iaBg').value;
    cell.style.borderColor = modal.querySelector('#iaBorder').value;

    overlay.remove();
  };

  modal.querySelector('#iaCancel').onclick = () => overlay.remove();
}

/* =========================
   UTIL: RGB → HEX
========================= */
function rgbToHex(rgb) {
  if (!rgb) return '#ffffff';
  if (rgb.startsWith('#')) return rgb;
  const result = rgb.match(/\d+/g);
  if (!result) return '#ffffff';
  return '#' + result.map(x => (+x).toString(16).padStart(2, '0')).join('');
}
