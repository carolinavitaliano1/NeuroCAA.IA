async function generateRoutine() {
  const text = document.getElementById('routineInput').value;

  const steps = await fetch('/api/routine', {
    method: 'POST',
    body: JSON.stringify({ text })
  }).then(r => r.json());

  window.currentBoard = steps.map(step => ({
    word: step.text,
    img: step.image
  }));

  renderBoard();
}
