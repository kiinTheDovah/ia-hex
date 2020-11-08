const Agent = require('ai-agents').Agent;

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }

    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send() {
        let board = this.perception;
        let size = board.length;
        let available = getHexAt(board, 0);
        let nTurn = size * size - available.length;
        console.log(nTurn);
        console.log(board);
        checkAround(board, [1, 1]);
        if (nTurn == 0) {
            // First move
            console.log([Math.floor(size / 2), Math.floor(size / 2) - 1]);
            return [Math.floor(size / 2), Math.floor(size / 2) - 1];
        } else if (nTurn == 1) {
            console.log([Math.floor(size / 2), Math.floor(size / 2)]);
            return [Math.floor(size / 2), Math.floor(size / 2)];
        }
        pathFinder(board, 1);
        let move =
            available[Math.round(Math.random() * (available.length - 1))];
        console.log('movimiento aleatorio');
        console.log(move);
        return move;
    }
}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board
 */
function getHexAt(board, pid) {
    let id = 0;
    switch (pid) {
        case 1:
            id = '1';
            break;
        case 2:
            id = '2';
            break;
        default:
            break;
    }
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === id) {
                result.push([k, j]);
            }
        }
    }
    return result;
}

function aroundPush(board, pos, i) {
    let aux;
    switch (board[pos[0] - 1][pos[1] + 1]) {
        case 0:
            aux = 0;
            break;
        case '1':
            aux = 1;
            break;
        default:
            // case '2'
            aux = 2;
            break;
    }
    around[aux].push(i);
}
function checkAround(board, pos) {
    let around = [[]];

    /* console.log('around');
    console.log(around); */
    let available = [];
    if (pos[0] != 0) {
        //no estoy arriba
        available.push([pos[0] - 1, pos[1]]);
        if (pos[0] != board.length - 1) {
            // no estoy ni arriba ni abajo
            available.push([pos[0] - 1, pos[1]]);
            if (pos[1] != 0) {
                //no estoy ni arriba ni abajo ni a la izquierda
                available.push([pos[0], pos[1] - 1]);
                available.push([pos[0] + 1, pos[1] - 1]);
            }
            if (pos[1] != board.length - 1) {
                // no estoy ni arriba ni abajo ni a la derecha
                available.push([pos[0] - 1, pos[1] + 1]);
                available.push([pos[0], pos[1] + 1]);
            }
        } else {
            //estoy abajo
            if (pos[1] != 0) {
                //estoy abajo pero no a la izquierda
                available.push([pos[0], pos[1] - 1]);
            }
            if (pos[1] != board.length - 1) {
                // estoy abajo pero no a la derecha
                available.push([pos[0] - 1, pos[1] + 1]);
                available.push([pos[0], pos[1] + 1]);
            }
        }
    } else {
        //estoy arriba
        // incomplete
    }
    let up = pos[0] == 0;
    let down = pos[0] == board.length - 1;
    let left = pos[1] == 0;
    let right = pos[1] == board.length - 1;

    for (let i = 0; i < 6; i++) {
        switch (i) {
            case 0: //arriba
                if (!up) {
                    aroundPush(board, pos, i);
                }
                break;
            case 1: //arriba & derecha
                if (!up && !right) {
                    aroundPush(board, pos, i);
                }
                break;
            case 2: //arriba
                if (pos[0] != 0) {
                    if (board[pos[0]][pos[1]] == 0) {
                        around[0].push(i);
                    } else if (board[pos[0]][pos[1]] == '1') {
                        around[1].push(i);
                    } else around[2].push(i);
                }
                break;
            case 3: //arriba
                if (pos[0] != 0) {
                    if (board[pos[0]][pos[1]] == 0) {
                        around[0].push(i);
                    } else if (board[pos[0]][pos[1]] == '1') {
                        around[1].push(i);
                    } else around[2].push(i);
                }
                break;
            case 4: //arriba
                if (pos[0] != 0) {
                    if (board[pos[0]][pos[1]] == 0) {
                        around[0].push(i);
                    } else if (board[pos[0]][pos[1]] == '1') {
                        around[1].push(i);
                    } else around[2].push(i);
                }
                break;
            case 5: //arriba
                if (pos[0] != 0) {
                    if (board[pos[0]][pos[1]] == 0) {
                        around[0].push(i);
                    } else if (board[pos[0]][pos[1]] == '1') {
                        around[1].push(i);
                    } else around[2].push(i);
                }
                break;

            default:
                break;
        }
    }

    for (let i = 0; i < available.length; i++) {
        if (board[available[i][0]][available[i][1]] == 0) {
            around[0].push(available[i]);
        } else if (board[available[i][0]][available[i][1]] == '1') {
        } else {
            around[2].push(available[i]);
        }
    }
    console.log('around');
    console.log(around);
}

function pathFinder(board, pid) {
    let playedMoves = getHexAt(board, pid);
    /*     if (playedMoves == null) {
        return;
    } */
    for (let i = 0; i < playedMoves.length; i++) {
        console.log(playedMoves[i]);
    }
}
