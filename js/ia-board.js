/* =========================================
   PRANCHA IA – GERAÇÃO AUTOMÁTICA
========================================= */

async function generateIABoard() {
  const input = document.getElementById('iaInput');
  const board = document.getElementById('iaBoard');
  if (!input || !board) return;

  const theme = input.value.trim();
  if (!theme) return;

  board.innerHTML = '⏳ Gerando prancha…';

  // 🔥 Simulação inteligente de passos (modelo inicial)
  const steps = inferStepsFromTheme(theme);

  board.innerHTML = '';

  for (const step of steps) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    // busca pictograma
    let imgSrc = '';
    try {
      const res = await fetch(API + encodeURIComponent(step));
      const data = await res.json();
      if (data[0]) {
        imgSrc = `https://static.arasaac.org/pictograms/${data[0]._id}/${data[0]._id}_300.png`;
      }
    } catch {}

    cell.innerHTML = `
      ${imgSrc ? `<img src="${imgSrc}" />` : ''}
      <div class="cell-text">${step}</div>
    `;

    // 🔥 MODAL IA EXCLUSIVO
    cell.onclick = () => openIAModal(cell);

    board.appendChild(cell);
  }
}

/* =========================================
   IA SIMPLES DE PASSOS (EVOLUTIVA)
========================================= */

function inferStepsFromTheme(text) {
  text = text.toLowerCase();

  if (text.includes('banheiro')) {
    return [
      'Ir ao banheiro',
      'Abaixar a roupa',
      'Usar o vaso',
      'Limpar-se',
      'Dar descarga',
      'Lavar as mãos'
    ];
  }

  if (text.includes('banho')) {
    return [
      'Entrar no banheiro',
      'Tirar a roupa',
      'Entrar no chuveiro',
      'Se ensaboar',
      'Enxaguar',
      'Secar-se'
    ];
  }

  // fallback genérico
  return [
    'Início da atividade',
    'Passo 1',
    'Passo 2',
    'Passo 3',
    'Finalizar'
  ];
}

/* =========================================
   LIMPAR
========================================= */

function clearIABoard() {
  document.getElementById('iaBoard').innerHTML = '';
  document.getElementById('iaInput').value = '';
}
