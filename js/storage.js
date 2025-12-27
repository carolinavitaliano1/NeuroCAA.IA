function saveLS(data){ localStorage.setItem('pranchas',JSON.stringify(data)); }
function loadLS(){ return JSON.parse(localStorage.getItem('pranchas')||'[]'); }

function saveBoard(){
  const list = loadLS();
  list.push({ id:Date.now(), date:new Date().toLocaleString('pt-BR'), board:currentBoard });
  saveLS(list);
  renderHistory();
  toast('Prancha salva!');
}

function clearBoard(){
  currentBoard=[];
  board.innerHTML='';
  phraseInput.value='';
}

function renderHistory(){
  historyList.innerHTML='';
  loadLS().reverse().forEach(i=>{
    const d=document.createElement('div');
    d.className='history-item';
    d.innerHTML=`${i.date}<br>${i.board.map(b=>b.word).join(' ')}`;
    historyList.appendChild(d);
  });
}

renderHistory();
