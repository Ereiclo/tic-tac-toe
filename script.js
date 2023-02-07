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
            let actualPlayer = gameMatrix[i][0];

            if (actualPlayer) {
                //check for every row if a player has won
                let countRow = 1;
                let countColumn = 1;

                for (let j = 1; j < matrixSize; ++j) {
                    if (gameMatrix[i][j] !== actualPlayer) ++countRow;
                    else if (gameMatrix[j][i] !== actualPlayer) ++countColumn;
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

        for (let i = 0; i < avaiblePositions.length; ++i) {
            if (avaiblePositions[i][0] === +row && avaiblePositions[i][1] === +col) {
                console.log(avaiblePositions.splice(i, 1));
                break;
            }
        }

        console.table(avaiblePositions);

    }

    function getElem(row, col) {
        return gameMatrix[row][col];
    }

    function iaRandomChoose(elem) {
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

    return { checkWinStatus, placeElem, iaRandomChoose, getMatrix };
})();


document.querySelectorAll(".cell").forEach((elem) => {
    elem.addEventListener("click", (e) => {
        let playerCell = e.currentTarget;
        if (!playerCell.getAttribute("data-player")) {
            let [playerRow, playerColumn] = playerCell
                .getAttribute("data-index")
                .split(" ");

            gameboard.placeElem("x", playerRow, playerColumn);

            let [iaRow, iaColumn] = gameboard.iaRandomChoose('o');
            let iaCell = document.querySelector(
                `[data-index="${iaRow} ${iaColumn}"]`
            );

            playerCell.setAttribute("data-player", 0);
            iaCell.setAttribute("data-player", 1);

            let cross = document.createElement("img");
            let circle = document.createElement("img");

            cross.setAttribute("src", "./close.svg");
            circle.setAttribute("src", "./circle.svg");

            playerCell.appendChild(cross);
            iaCell.appendChild(circle);

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


document.querySelector('.restart-section > button', (e) => {
    gameboard.reset();
    document.querySelectorAll('.cell').forEach((elem) => {
        elem.removeAttribute('data-player');
    })

    document.querySelectorAll('.cell > img').forEach((elem) => {
        elem.remove();
    })
})