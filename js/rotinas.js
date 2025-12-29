/* =========================
   ROTINAS VISUAIS – NeuroCAA
========================= */

const ROUTINE_MAP = {
  banheiro: [
    "ir ao banheiro",
    "abaixar a calça",
    "sentar no vaso sanitário",
    "fazer xixi",
    "usar papel higiênico",
    "dar descarga",
    "lavar as mãos",
    "secar as mãos"
  ],

  banho: [
    "tirar a roupa",
    "entrar no chuveiro",
    "ligar o chuveiro",
    "molhar o corpo",
    "passar sabonete",
    "enxaguar",
    "desligar o chuveiro",
    "secar o corpo",
    "vestir a roupa"
  ],

  dentes: [
    "pegar a escova",
    "colocar pasta de dente",
    "escovar os dentes",
    "enxaguar a boca",
    "cuspir",
    "lavar a escova",
    "guardar a escova"
  ],

  dormir: [
    "guardar brinquedos",
    "vestir pijama",
    "escovar os dentes",
    "deitar na cama",
    "apagar a luz",
    "dormir"
  ]
};

/* =========================
   GERAR ROTINA AUTOMÁTICA
========================= */

async function generateRoutine() {
  const input = document.getElementById('routineInput');
  if (!input) return;

  const text = input.value.toLowerCase();
  if (!text) return;

  let steps = [];

  // 🔍 Detecta o tema
  if (text.includes("banheiro")) steps = ROUTINE_MAP.banheiro;
  else if (text.includes("banho")) steps = ROUTINE_MAP.banho;
  else if (text.includes("dente")) steps = ROUTINE_MAP.dentes;
  else if (text.includes("dormir")) steps = ROUTINE_MAP.dormir;

  if (!steps.length) {
    alert("Não consegui identificar a rotina. Tente algo como: ir ao banheiro, banho, escovar dentes.");
    return;
  }

  // 🔄 Limpa prancha atual
  window.currentBoard = [];

  for (const step of steps) {
    let data = [];
    try {
      const res = await fetch(API + encodeURIComponent(step));
      data = await res.json();
    } catch {}

    const pic = data[0];

    window.currentBoard.push({
      word: step,
      customText: null,
      img: pic
        ? `https://static.arasaac.org/pictograms/${pic._id}/${pic._id}_300.png`
        : null,
      bgColor: null,
      borderColor: null
    });
  }

  // 🧩 Renderiza com MESMA lógica da prancha
  renderBoard();
}
