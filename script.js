document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll(".button");
    const restart = document.querySelector(".restart");
    const playAI = document.querySelector(".play-ai");
    const msg = document.querySelector("#msg");
    const messageContainer = document.querySelector(".msg-container");
    const msgdraw = document.querySelector(".msgdraw");
    const draw = document.querySelector("#draw");

    let turnO = true;
    let count = 0;
    let isAI = false;

    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const resetGame = () => {
        buttons.forEach(button => {
            button.innerText = "";
            button.disabled = false;
            button.classList.remove("o-move", "x-move", "winning-line");
        });
        msg.innerText = "";
        messageContainer.classList.add("hide1");
        msgdraw.classList.add("hide2");
        turnO = true;
        count = 0;
        isAI = false;
    };

    restart.addEventListener("click", resetGame);

    playAI.addEventListener("click", () => {
        resetGame();
        isAI = true;
    });

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            playerMove(button);
            if (isAI && !turnO) {
                aiMove();
            }
        });
    });

    const playerMove = (button) => {
        if (turnO) {
            button.innerText = "O";
            button.classList.add("o-move");
            turnO = false;
        } else {
            button.innerText = "X";
            button.classList.add("x-move");
            turnO = true;
        }
        button.disabled = true;
        count++;
        if (checkWinner()) return;
        if (count === 9) checkDraw();
    };

    const disableButtons = () => {
        buttons.forEach(button => {
            button.disabled = true;
        });
    };

    const checkDraw = () => {
        draw.innerText = "Match Draw !!!";
        msgdraw.classList.remove("hide2");
        disableButtons();
    };

    const showWinner = (winner) => {
        msg.innerText = `Winner is ${winner}`;
        messageContainer.classList.remove("hide1");
        disableButtons();
    };

    const checkWinner = () => {
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (buttons[a].innerText && buttons[a].innerText === buttons[b].innerText && buttons[a].innerText === buttons[c].innerText) {
                pattern.forEach(index => {
                    buttons[index].classList.add("winning-line");
                });
                showWinner(buttons[a].innerText);
                return true;
            }
        }
        return false;
    };

    const aiMove = () => {
        let bestMove = findBestMove();
        if (bestMove !== -1) {
            buttons[bestMove].innerText = "X";
            buttons[bestMove].classList.add("x-move");
            buttons[bestMove].disabled = true;
            turnO = true;
            count++;
            if (checkWinner()) return;
            if (count === 9) checkDraw();
        }
    };

    const findBestMove = () => {
        let bestVal = -Infinity;
        let bestMove = -1;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText === "") {
                buttons[i].innerText = "X";
                let moveVal = minimax(0, false, -Infinity, Infinity);
                buttons[i].innerText = "";
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestMove;
    };

    const minimax = (depth, isMaximizing, alpha, beta) => {
        if (checkWin("X")) return 10 - depth;
        if (checkWin("O")) return depth - 10;
        if (count === 9) return 0;

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].innerText === "") {
                    buttons[i].innerText = "X";
                    count++;
                    let value = minimax(depth + 1, false, alpha, beta);
                    buttons[i].innerText = "";
                    count--;
                    best = Math.max(best, value);
                    alpha = Math.max(alpha, best);
                    if (beta <= alpha) break;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].innerText === "") {
                    buttons[i].innerText = "O";
                    count++;
                    let value = minimax(depth + 1, true, alpha, beta);
                    buttons[i].innerText = "";
                    count--;
                    best = Math.min(best, value);
                    beta = Math.min(beta, best);
                    if (beta <= alpha) break;
                }
            }
            return best;
        }
    };

    const checkWin = (player) => {
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (buttons[a].innerText === player && buttons[b].innerText === player && buttons[c].innerText === player) {
                return true;
            }
        }
        return false;
    };
});
