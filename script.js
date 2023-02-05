let gameboard = (function () {
  let gameMatrix = [];
  let avaiblePositions = [];
  let placedElements = 0;
  let matrixSize = 3;

  function isFull() {
    return placedElements === matrixSize * matrixSize;
  }

  function checkWinStatus() {
    for (let i = 0; i < matrixSize; ++i) {
      let actualPlayer = gameMatrix[i][0];

      if (actualPlayer) {
        //check for every row if a player has won
        let countRow = 1;
        let countColumn = 1;

        for (let j = 1; j < matrixSize; ++j) {
          if (gameMatrix[i][j] !== actualPlayer) ++count;
          else if (gameMatrix[j][i] !== actualPlayer) ++count;
        }
        if (countRow === matrixSize || countColumn === matrixSize)
          return actualPlayer;

        //check for every column if a player has won
      }
    }

    //check for diagonals;

    let diagPlayer = gameMatrix[0][0];

    if (diagPlayer) {
      let diagCount = 1;
      for (let i = 1; i < matrixSize; ++i) {
        if (gameMatrix[i][i] === diagPlayer) diagCount++;
      }

      if (diagCount === matrixSize) return diagPlayer;
    }

    let negDiagPlayer = gameMatrix[matrixSize - 1][matrixSize - 1];

    if (negDiagPlayer) {
      let negDiagCount = 1;

      for (let i = 0; i < matrixSize; ++i) {
        if (gameMatrix[i][matrixSize - 1 - i]) negDiagCount++;
      }

      if (negDiagCount == matrixSize) return negDiagPlayer;
    }

    return isFull() ? "tie" : "not finished";
  }

  function placeElem(elem, row, col) {
    gameMatrix[row][col] = elem;
    ++placedElements;
  }

  function iaRandomChoose(elem) {
    let randomIndex = Math.floor(Math.random() * avaiblePositions.length);

    let [row, col] = avaiblePositions.splice(randomIndex, 1);

    placeElem(elem, row, col);
  }

  function getMatrix() {
    return gameMatrix;
  }

  function createBoard() {
    for (let i = 0; i < matrixSize; ++i) {
      let actualRow = [];

      for (let j = 0; j < matrixSize; ++j) {
        actualRow.push(null);
        avaiblePositions.push([i, j]);
      }

      gameMatrix.push(actualRow);
    }
  }

  function reset() {
    gameMatrix = [];
    avaiblePositions = [];
    placedElements = 0;
    createBoard();
  }

  return { checkWinStatus, placeElem, iaRandomChoose, gameMatrix };
})();