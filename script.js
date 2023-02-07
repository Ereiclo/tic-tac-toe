let gameboard = (function() {
    let gameMatrix = [];
    let avaiblePositions = [];
    let placedElements = 0;
    let matrixSize = 3;

    function isFull() {
        return placedElements === matrixSize * matrixSize;
    }

    function checkWinStatus() {
        for (let i = 0; i < matrixSize; ++i) {
            let colPlayer = gameMatrix[0][i];
            let rowPlayer = gameMatrix[i][0];

            if (colPlayer || rowPlayer) {
                //check for every row if a player has won
                let countRow = rowPlayer ? 1 : 0;
                let countColumn = colPlayer ? 1 : 0;

                for (let j = 1; j < matrixSize; ++j) {
                    if (rowPlayer && gameMatrix[i][j] === rowPlayer) ++countRow;
                    if (colPlayer && gameMatrix[j][i] === colPlayer) ++countColumn;
                }
                if (countRow === matrixSize)
                    return rowPlayer;
                else if (countColumn === matrixSize)
                    return colPlayer;
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

        let negDiagPlayer = gameMatrix[0][matrixSize - 1];

        if (negDiagPlayer) {
            let negDiagCount = 1;

            for (let i = 1; i < matrixSize; ++i) {
                if (gameMatrix[i][matrixSize - 1 - i] === negDiagPlayer) negDiagCount++;
            }

            if (negDiagCount == matrixSize) return negDiagPlayer;
        }

        return isFull() ? "tie" : "not finished";
    }

    function placeElem(elem, row, col) {
        gameMatrix[row][col] = elem;
        ++placedElements;

        for (let i = 0; i < avaiblePositions.length; ++i) {
            if (avaiblePositions[i][0] === +row && avaiblePositions[i][1] === +col) {
                console.log(avaiblePositions.splice(i, 1));
                break;
            }
        }

        // console.table(avaiblePositions);

    }

    function getElem(row, col) {
        return gameMatrix[row][col];
    }

    function iaRandomChoose(elem) {
        if (avaiblePositions.length === 0 || checkWinStatus() !== 'not finished') return [-1, -1];

        let randomIndex = Math.floor(Math.random() * avaiblePositions.length);


        let [row, col] = avaiblePositions.splice(randomIndex, 1)[0];
        console.log(row, col)

        // console.log(avaiblePositions.splice(randomIndex, 1));

        placeElem(elem, row, col);

        return [row, col];
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

    createBoard();

    return { checkWinStatus, placeElem, iaRandomChoose, getMatrix, reset };
})();


document.querySelectorAll(".cell").forEach((elem) => {
    elem.addEventListener("click", (e) => {
        if (gameboard.checkWinStatus() !== 'not finished') return;

        let playerCell = e.currentTarget;
        if (!playerCell.getAttribute("data-player")) {
            let [playerRow, playerColumn] = playerCell
                .getAttribute("data-index")
                .split(" ");

            gameboard.placeElem("x", playerRow, playerColumn);
            let cross = document.createElement("img");
            cross.setAttribute("src", "./close.svg");
            playerCell.setAttribute("data-player", 0);
            playerCell.appendChild(cross);

            let [iaRow, iaColumn] = gameboard.iaRandomChoose('o');

            if (iaRow >= 0) {
                let iaCell = document.querySelector(
                    `[data-index="${iaRow} ${iaColumn}"]`
                );
                iaCell.setAttribute("data-player", 1);
                let circle = document.createElement("img");
                circle.setAttribute("src", "./circle.svg");
                iaCell.appendChild(circle);

            }




            let gameboardStatus = gameboard.checkWinStatus();
            let resultDiv = document.querySelector('.result');

            if (gameboardStatus === 'tie') {

                resultDiv.innerText = 'It\'s a tie';


            } else if (gameboardStatus === 'x') {
                resultDiv.innerText = 'The winner is you!';
            } else if (gameboardStatus === 'o') {
                resultDiv.innerText = 'The computer wins!';
            }
        }
    });
});


document.querySelector('.restart-section > button').addEventListener('click', (e) => {
    console.log('Uwu');

    gameboard.reset();

    document.querySelector('.result').innerText = '';

    document.querySelectorAll('.cell').forEach((elem) => {
        elem.removeAttribute('data-player');
    })

    document.querySelectorAll('.cell > img').forEach((elem) => {
        elem.remove();
    })
})