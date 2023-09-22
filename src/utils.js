/*
-3  td_cabecalho
-2  td_lateral
-1  td_corNormal
0  insertada td_corNormal con hidden true por la funcion
<numDeSpan>  td_tipologia_X con rowspan = <numDeSpan>
*/

const HEADER = -3;
const LATERAL = -2;
const BLANK = -1;
const DEFAULT = 1;
const INSERT = 0;

function processCell(cell) {
  const rowspan = parseInt(cell.getAttribute('rowspan') || DEFAULT, 10);
  const colspan = parseInt(cell.getAttribute('colspan') || DEFAULT, 10);

  const className = Array.from(cell.classList).find(cls => cls.startsWith('td_tipologia'));

  if (cell.classList.contains('td_cabecalho')) {
    return [HEADER, colspan];
  } else if (cell.classList.contains('td_lateral')) {
    return [LATERAL, colspan];
  } else if (cell.classList.contains('td_corNormal')) {
    return [BLANK, colspan];
  } else if ({ className, colspan }) {
    return [rowspan, colspan];
  } else {
    return [DEFAULT, colspan];
  }

}


function tableToMatrix(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  const matrix = [];

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll('td'));
    const matrixRow = [];

    cells.forEach((cell) => {
      const cellData = processCell(cell);
      matrixRow.push(cellData);
    });

    matrix.push(matrixRow);
  });

  return matrix;
}


function processMatrix(matrix) {
  const headerIndex = matrix.findIndex((row) => row[0][0] === HEADER);
  const headerRow = matrix[headerIndex];
  const debtArray = [];

  headerRow.forEach((cell) => {
    for (let i = 0; i < cell[1]; i++) {
      debtArray.push({
        headerColspan: cell[1],
        debt: 0,
        cellColspan: 0,
      });
    }
  });

  matrix.forEach((row) => {
    debtArray.forEach((debtObj, debtIndex) => {
      if (debtObj.debt > 0) {
        for (let i = 0; i < debtObj.cellColspan; i++) {
          row.splice(debtIndex, 0, [INSERT, 1]);
        }
        debtObj.debt -= 1;
      }
    });

    row.forEach((cell, columnIndex) => {
      if (cell[0] > 1) {
        debtArray[columnIndex].debt += cell[0] - 1;
        debtArray[columnIndex].cellColspan = cell[1];
      }

      if (cell[0] !== HEADER) {
        for (let i = 1; i < cell[1]; i++) {
          row.splice(columnIndex + 1, 0, [INSERT, 1]);
        }
      }
    });
  });

  return matrix;
}




/* adds the hidden cells to the table */
function addCellsToTable(table, matrix) {
  matrix.forEach((row, rowIndex) => {
    if (rowIndex < 5) return;  // Comenzar a modificar a partir de la sexta fila
    
    const htmlRow = table.querySelectorAll('tr')[rowIndex];
    if (!htmlRow) return;

    row.forEach((cellValue, matrixCellIndex) => {
      if (cellValue[0] === 0 && cellValue[1] === 1) {
        const newCell = document.createElement('td');
        newCell.className = 'td_corNormal';
        newCell.style.minWidth = '10px';
        newCell.hidden = true;
        newCell.innerHTML = '&nbsp;';

        const currentHtmlCells = Array.from(htmlRow.querySelectorAll('td'));

        if (currentHtmlCells[matrixCellIndex] && htmlRow.contains(currentHtmlCells[matrixCellIndex])) {
          htmlRow.insertBefore(newCell, currentHtmlCells[matrixCellIndex]);
        } else {
          htmlRow.appendChild(newCell);
        }
      }
    });
  });
}


/* removes the <a> tags from the table */
function removeATags(table) {
  const anchorTags = table.querySelectorAll('a');
  anchorTags.forEach(aTag => {
    const textContent = aTag.textContent;
    const parent = aTag.parentNode;
    parent.insertBefore(document.createTextNode(textContent), aTag);
    parent.removeChild(aTag);
  });
}


let wrapperedEventListener;

function editTable() {
  const table = document.querySelector('.tabela_principal');
  if (!window.originalContent) {
    window.originalContent = table.innerHTML;
  }
  
  removeATags(table);
  
  const rawMatrix = tableToMatrix(table);
  const processedMatrix = processMatrix(rawMatrix);
  addCellsToTable(table, processedMatrix);
  wrapperedEventListener = (event) => eventListener(event, table);
  table.addEventListener('click', wrapperedEventListener);
}

function stopEditingTable() {
  const table = document.querySelector('.tabela_principal');
  table.removeEventListener('click', wrapperedEventListener);
}

const eventListener = (event, table) => {
  const target = event.target;
  if (target.tagName === 'TD') {
    const rowIndex = Array.from(target.parentNode.parentNode.children).indexOf(target.parentNode);
    const cellIndex = Array.from(target.parentNode.children).indexOf(target);
    if (rowIndex > 3 && cellIndex > 0) {
      const rowspanValue = parseInt(target.getAttribute('rowspan') || DEFAULT, 10);
      const colspanValue = parseInt(target.getAttribute('colspan') || DEFAULT, 10);

      for (let r = 0; r < rowspanValue; r++) {
        for (let c = 0; c < colspanValue; c++) {
          if (r === 0 && c === 0) continue;  
          const newCell = document.createElement('td');
          newCell.className = 'td_corNormal';
          newCell.innerHTML = '&nbsp;';
          if (r === 0) {
            target.parentNode.insertBefore(newCell, target.nextSibling);
          } else {
            // Insert new cells in the below rows
            table.rows[rowIndex + r].insertBefore(newCell, table.rows[rowIndex + r].cells[cellIndex + c]);
          }
        }
      }
      const newCell = document.createElement('td');
          newCell.className = 'td_corNormal';
          newCell.innerHTML = '&nbsp;';
      target.parentNode.replaceChild(newCell, target);
    }
  }
};

  



function updateTable(storageKey) {
  chrome.runtime.sendMessage({ action: "getTable", key: storageKey }, (response) => {
    const tableElement = document.querySelector('.tabela_principal');
    if (!window.originalContent && tableElement && tableElement.innerHTML) {
      window.originalContent = tableElement.innerHTML;
    }
    if (response && response.table) {
      tableElement.innerHTML = response.table;
    }
  });
}


function resetTable() {
  const tableElement = document.querySelector('.tabela_principal');
  if (window.originalContent) {
    tableElement.innerHTML = window.originalContent;
  }
}

function saveTable(storageKey) {
  const tableHTML = document.querySelector('.tabela_principal').innerHTML;
  chrome.runtime.sendMessage({ action: "saveTable", table: tableHTML, key: storageKey });
}

function downloadTable() {
  let originalTable = document.querySelector('.tabela_principal');
  let copy = originalTable.cloneNode(true);
  copy.querySelectorAll(".tr_branca").forEach((e) => e.parentNode.removeChild(e));
  document.body.appendChild(copy);
  domtoimage.toPng(copy)
    .then( (dataUrl) => {
      chrome.runtime.sendMessage({ action: "download", data: dataUrl });
      document.body.removeChild(copy);
    })
    .catch( (error) => {
      console.error('Error al convertir la tabla a imagen', error);
      document.body.removeChild(copy);
    });
}




/* export functions for testing */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { processMatrix, tableToMatrix, addCellsToTable, removeATags, editTable, stopEditingTable };
}