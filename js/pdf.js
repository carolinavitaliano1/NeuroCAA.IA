function exportBoardToPDF(){
  html2canvas(board).then(c=>{
    const { jsPDF } = window.jspdf;
    const pdf=new jsPDF('landscape');
    pdf.addImage(c.toDataURL(),'PNG',10,10,280,0);
    pdf.save('prancha-neurocaa.pdf');
  });
}
