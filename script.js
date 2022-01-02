const gameBoard = (() => {
    
    const blankBoard = ['', '', '', '', '', '', '', '', ''];
    let board = [...blankBoard];
    let gameOver = 0;
    let firstTurn = 0;
    let turn = firstTurn;
    const markers = ['X', 'O'];

    const getTurn = () => {
        return turn;
    };

    const getTurnMarker = () => {
        return markers[turn];
    };
    
    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        let win = false;

        winConditions.forEach((condition) => {
            if (board[condition[0]] == markers[turn]
                && board[condition[1]] == markers[turn]
                && board[condition[2]] == markers[turn]) {
                    win = true;
                }
        });

        return win;
    };

    const checkComplete = () => {
        const complete = board.every((square) => {
            return square.length > 0;
        });

        return complete;
    };

    const reset = (() => {
        board = [...blankBoard];
        gameOver = 0;
        displayController.write(board);

        firstTurn = (firstTurn + 1) % 2;
        turn = firstTurn;
        displayController.setTurn();
    });

    const mark = (e) => {
        const coord = e.target.id;

        if (gameOver === 0 && board[coord].length === 0) {
            board[coord] = markers[turn];
            displayController.write(board);
            
            if (checkWinner()) {
                gameOver = 1;
                displayController.deactivate(board);
                displayController.endGame(`${players[turn].name} wins! :)`);
            } else if(checkComplete()) {
                gameOver = 1;
                displayController.deactivate(board);
                displayController.endGame('Draw');
            }

            turn = (turn + 1) % 2;
            displayController.setTurn();
        }
    };

    return {reset, mark, getTurn, getTurnMarker};

})();

const displayController = (() => {

    const reset = document.getElementById('reset');
    const p1Name = document.getElementById('p1__name');
    const p2Name = document.getElementById('p2__name');
    const turn = document.getElementById('turn');
    const turnName = document.getElementById('turn__name');
    const turnMarker = document.getElementById('turn__marker');
    const cells = document.querySelectorAll('.cell');
    const modal = document.getElementById('modal__endGame');
    const modalClose = document.querySelector('.modal-close');
    const modalHeading = document.querySelector('.modal-heading');
    const modalText = document.querySelector('.modal-text');

    const setTurn = () => {
        turnName.innerText = players[gameBoard.getTurn()].name;
        turnMarker.innerText = gameBoard.getTurnMarker();
        turn.classList.remove('X', 'O');
        turn.classList.add(gameBoard.getTurnMarker());
    };

    const setPlayerName = (e) => {
        const id = e.target.id;

        if (id === p1Name.id) {
            if (p1Name.value.length === 0) {
                players[0].name = 'Player 1';
            } else {
                players[0].name = p1Name.value;
            }
        } else if (id === p2Name.id) {
            if (p2Name.value.length === 0) {
                players[1].name = 'Player 2';
            } else {
                players[1].name = p2Name.value;
            }
        }

        setTurn();
    }

    const initialize = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', gameBoard.mark);
        });

        reset.addEventListener('click', gameBoard.reset);
        p1Name.addEventListener('change', setPlayerName);
        p2Name.addEventListener('change', setPlayerName);

        modalClose.onclick = () => {
            modal.style.display = "none";
        };

        window.onclick = (e) => {
            if (e.target == modal) {
                modal.style.display = "none";
            }
        };

    };
    
    const write = (board => {
        board.map((cell, num) => {
            cells[num].innerText = cell;
            if (board[num].length === 0) {
                cells[num].classList.remove('X', 'O');
                cells[num].classList.add('available');
            } else {
                cells[num].classList.remove('available');
                cells[num].classList.add(cell);
            };
        });
    });

    const deactivate = (board => {
        board.map((cell, num) => {
            cells[num].innerText = cell;
            if (board[num].length === 0) {
                cells[num].classList.remove('available');
            };
        });
    });

    const endGame = ((message) => {
        modalHeading.innerText = 'Game over!';
        modalText.innerText = message;
        modal.style.display = "block";
    });

    return {setTurn, initialize, write, deactivate, endGame};

})();

const Player = (name) => {
    return {name};
};

let players = [];
players[0] = Player('Player 1');
players[1] = Player('Player 2');

displayController.setTurn();
displayController.initialize();