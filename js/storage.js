/*************************************************
 * STORAGE.JS – NeuroCAA
 * Objetivo:
 * - Salvar pranchas completas (não só texto)
 * - Manter histórico funcional
 * - NÃO remover nada existente
 *************************************************/

/**
 * Estrutura de uma prancha salva:
 * {
 *   id,
 *   createdAt,
 *   text,
 *   board: [
 *     {
 *       id,
 *       label,
 *       image,
 *       color,
 *       category
 *     }
 *   ]
 * }
 */

const STORAGE_KEY = "neurocaa_boards";

/* ================================
   UTILIDADES BÁSICAS
================================ */

function getAllBoards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAllBoards(boards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

function generateId() {
  return "board_" + Date.now();
}

/* ================================
   SALVAR PRANCHA COMPLETA
================================ */

function saveBoard({ text, board }) {
  const boards = getAllBoards();

  const newBoard = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    text: text || "",
    board: board || []
  };

  boards.unshift(newBoard); // histórico mais recente primeiro
  saveAllBoards(boards);

  return newBoard;
}

/* ================================
   HISTÓRICO
================================ */

function getHistory() {
  return getAllBoards();
}

function getBoardById(id) {
  const boards = getAllBoards();
  return boards.find(b => b.id === id);
}

/* ================================
   ATUALIZAR PRANCHA EXISTENTE
   (usado pelo modal)
================================ */

function updateBoard(boardId, updatedBoard) {
  const boards = getAllBoards();

  const index = boards.findIndex(b => b.id === boardId);
  if (index === -1) return null;

  boards[index] = {
    ...boards[index],
    ...updatedBoard,
    updatedAt: new Date().toISOString()
  };

  saveAllBoards(boards);
  return boards[index];
}

/* ================================
   REMOVER PRANCHA (opcional)
================================ */

function deleteBoard(boardId) {
  const boards = getAllBoards().filter(b => b.id !== boardId);
  saveAllBoards(boards);
}

/* ================================
   EXPORTAÇÃO (para PDF / futuro)
================================ */

function exportBoardData(boardId) {
  return getBoardById(boardId);
}

/* ================================
   DEBUG (não interfere)
================================ */

window.NeuroCAAStorage = {
  saveBoard,
  getHistory,
  getBoardById,
  updateBoard,
  deleteBoard,
  exportBoardData
};


