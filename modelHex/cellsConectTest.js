let board = [
    //  0 1 2 3 4 5 6
    [0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0], // 1
    [0, 0, 0, 0, 2, 0, 0], // 2
    [0, 0, 1, 0, 0, 0, 0], // 3
    [0, 0, 2, 1, 0, 0, 0], // 4
    [0, 1, 0, 0, 1, 0, 0], // 5
    [0, 0, 1, 0, 0, 0, 0],
]; // 6

puentes(board, 1, 'MAX') - puentes(board, 2, 'MAX');

//console.log(checkAround(board,[3,3]))
//console.log(ourIncludes(checkAround(board,[3,3])[0],6))

/**
 * Retorna cual es el rival.
 * @param {Matrix} board
 */
function rival(id_Agent) {
    return id_Agent == 1 ? 2 : 1;
}

/**
 * Cuenta la cantidad de puentes en un board.
 * @param {Matrix} board
 * @param {int} id_Agent
 */
function puentes(board = [], id_Agent, type) {
    let valor = 0;

    if (type == 'MIN') {
        id_Agent = rival(id_Agent);
    }

    for (let i = 0; i < board.length - 1; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (
                board[i][j] == id_Agent &&
                (board[i][j - 1] !== rival(id_Agent) &&
                    board[i + 1][j - 1] !== rival(id_Agent))
            ) {
                try {
                    if (board[i + 1][j - 2] == id_Agent) {
                        valor = valor + 1;
                        console.log(
                            'Hay un puente a la IZQUIERDA de: ',
                            [i, j],
                            'es',
                            [i + 1, j - 2]
                        );
                    }
                } catch (e) {}
                try {
                    if (
                        board[i + 2][j - 1] == id_Agent &&
                        (board[i + 1][j - 1] !== rival(id_Agent) &&
                            board[i + 1][j] !== rival(id_Agent))
                    ) {
                        valor = valor + 1;
                        console.log('Hay un puente ABAJO de: ', [i, j], 'es', [
                            i + 2,
                            j - 1,
                        ]);
                    }
                } catch (e) {}
                try {
                    if (
                        board[i + 1][j + 1] == id_Agent &&
                        (board[i + 1][j] !== rival(id_Agent) &&
                            board[i][j + 1] !== rival(id_Agent))
                    ) {
                        valor = valor + 1;
                        console.log(
                            'Hay un puente a la DERECHA de: ',
                            [i, j],
                            'es',
                            [i + 1],
                            ',',
                            [j + 1]
                        );
                    }
                } catch (e) {}
            }
        }
    }
    console.log('numero de puentes: ', valor);
    return valor;
}
