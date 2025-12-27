async function generateBoard() {
  const phrase = phraseInput.value.trim();
  if (!phrase) return;

  currentBoard = [];

  for (const word of phrase.split(/\s+/)) {
    let data = [];
    try {
      const res = await fetch(API + encodeURIComponent(word));
      data = await res.json();
    } catch {}

    const pic = data[0];
    currentBoard.push({
      word,
      img: pic ? `https://static.arasaac.org/pictograms/${pic._id}/${pic._id}_300.png` : null,
      customText: null,
      bgColor: '#ffffff',
      borderColor: '#e2e8f0'
    });
  }
  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';

  const title = boardTitle.value.trim();
  if (title) {
    const t = document.createElement('div');
    t.textContent = title;
    t.style.gridColumn = '1/-1';
    t.style.fontWeight = '700';
    t.style.textAlign = 'center';
    board.appendChild(t);
  }

  currentBoard.forEach((item, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.background = item.bgColor;
    cell.style.border = `2px solid ${item.borderColor}`;
    cell.innerHTML = `
      ${item.img ? `<img src="${item.img}">` : ''}
      <div>${item.customText || item.word}</div>
    `;
    cell.onclick = () => openQuickEditModal(i);
    board.appendChild(cell);
  });
}
