const { default: Matrix } = require('ml-matrix');

let board = [
    //  0 1 2 3 4 5 6
    [0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0], // 1
    [0, 0, 0, 0, 2, 0, 0], // 2
    [0, 0, 1, 1, 2, 0, 0], // 3
    [0, 0, 2, 1, 0, 0, 0], // 4
    [0, 1, 0, 0, 0, 0, 0], // 5
    [0, 0, 1, 0, 0, 0, 0],
]; // 6

let cells = countConnects(board, 1) - countConnects(board, 2) / 2;
console.log('valor de las connecciones: ', cells);

/* 
    PENSAMIENTOS: 
        Prioridades de la heurística:
        Conectar un puente único entre dos celdas > hacer puente doble > simplemente agregar una linea más
*/
//console.log(checkAround(board,[3,3]))
//console.log(ourIncludes(checkAround(board,[3,3])[0],6))

/**
 * Retorna cual es el rival.
 * @param {Number} board
 */
function rival(id_Agent) {
    return id_Agent == 1 ? 2 : 1;
}

function getHexAt(board, pid) {
    let id = 0;
    switch (pid) {
        case 1:
            id = 1;
            break;
        case 2:
            id = 2;
            break;
        default:
            break;
    }
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] == pid) {
                //result.push(k * size + j);
                result.push([k, j]);
            }
        }
    }
    return result;
}

/**
 * Returns 3 arrays the first contain the relative position of the empty cells around
 * The second array contains the relative position of the cells occupied by player 1
 * And third array contains the relative position of the cells occupied by player 2
 * Relative Positions:
 * Up          : 0
 * Up & Right  : 1
 * Right       : 2
 * Down        : 3
 * Down & Left : 4
 * Left        : 5
 * @param {Array} board
 * @param {Array} pos
 */
function checkAround(board, pos) {
    let around = [[], [], []];
    let up = pos[0] == 0;
    let down = pos[0] == board.length - 1;
    let left = pos[1] == 0;
    let right = pos[1] == board.length - 1;

    for (let i = 0; i < 6; i++) {
        switch (i) {
            case 0: //up
                if (!up) {
                    around[board[pos[0] - 1][pos[1]]].push(i);
                }
                break;
            case 1: //up & right
                if (!up && !right) {
                    around[board[pos[0] - 1][pos[1] + 1]].push(i);
                }
                break;
            case 2: //right
                if (!right) {
                    around[board[pos[0]][pos[1] + 1]].push(i);
                }
                break;
            case 3: //down
                if (!down) {
                    around[board[pos[0] + 1][pos[1]]].push(i);
                }
                break;
            case 4: // down & left
                if (!down && !left) {
                    around[board[pos[0] + 1][pos[1] - 1]].push(i);
                }
                break;
            case 5: //left
                if (!left) {
                    around[board[pos[0]][pos[1] - 1]].push(i);
                }
                break;
        }
    }
    return around;
}
/**
 * Rank the connections for a given player in a board.
 * having a piece that connects with two others rank the highest, then having a triple connection
 * @param {Array} board
 * @param {Number} pid //player id
 */
function countConnects(board, pid) {
    let cells = 0;
    let playerChips = getHexAt(board, 1);
    let rid = rival(pid); //rival id
    let length = board.length;
    let valOf0C = 0;
    let valOf1C = 2;
    let valOf2C = 4;
    let valOf3C = 3;
    let valOf4plusC = 1;

    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (board[i][j] == pid) {
                let around = checkAround(board, [i, j]);
                console.log(around[pid].length);
                switch (around[pid].length) {
                    case 0:
                        cells += valOf0C;
                        break;
                    case 1:
                        cells += valOf1C;
                        break;
                    case 2:
                        cells += valOf2C;
                        break;
                    case 3:
                        cells += valOf3C;
                        break;

                    default:
                        cells += valOf4plusC;
                        // 0 connections or 3 or more
                        break;
                }
            }
        }
    }
    return cells;
}
