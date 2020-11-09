const Agent = require('ai-agents').Agent;
//const readline = require('readline');
let infinito = 9999999999;
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
        var start = new Date().getTime();
        let board = this.perception;
        let size = board.length;
        let available = getHexAt(board, 0);
        let nTurn = size * size - available.length;
        let limite = 10;
        let agente = this.getID();
        let raiz = {
            type: 'MAX',
            mown: -infinito,
            utility: -infinito,
            board: board,
            action: null,
        };

        /* if (nTurn % 2 == 0) {
            // == 0 primer turno // == 1 segundo turno
            let row = prompt('row: ', '0');
            let column = prompt('column: ', '0');
            let play = [row, column];
            console.log('hooman: ', play);
            return play;
        } */
        if (nTurn == 0) {
            // First move
            //console.log('el turno del agente: ',this.getID())
            console.log('jugada:', [
                Math.floor(size / 2),
                Math.floor(size / 2) - 1,
            ]);
            return [Math.floor(size / 2), Math.floor(size / 2) - 1];
        } else if (nTurn == 1) {
            //console.log('el turno del agente: ',this.getID())
            console.log('jugada:', [
                Math.floor(size / 2),
                Math.floor(size / 2),
            ]);
            return [Math.floor(size / 2), Math.floor(size / 2)];
        }
        console.log('creating Yggdrasil...');
        let fullTree = makeTree(board, limite, agente, raiz);
        console.log('tree: ', fullTree);
        var endMakeTree = new Date().getTime();
        var timeMakeTree = (endMakeTree - start) / 1000;
        console.log('timeMakeTree: ', timeMakeTree, 's');

        /* var startAux = new Date().getTime();
        let greatMinmax = minmax(fullTree);
        var endMinMax = new Date().getTime();
        var timeMinMax = (endMinMax - startAux) / 1000;
        console.log('timeMinMax: ', timeMinMax, 's');*/

        /*startAux = new Date().getTime();
        let move = turn(greatMinmax);
        var endturn = new Date().getTime();
        var timeTurn = (endturn - startAux) / 1000;
        console.log('timeTurn: ', timeTurn, 's'); */

        var endFull = new Date().getTime();
        var timeFull = (endFull - start) / 1000;
        console.log('timeFull: ', timeFull, 's');

        return available[Math.round(Math.random() * (available.length - 1))];
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

function checkAround(board, pos) {
    let around = [[], [], []];

    /* console.log('around');
    console.log(around); */

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

function pathFinder(board, pid) {
    let playedMoves = getHexAt(board, pid);
    /*     if (playedMoves == null) {
        return;
    } */
    for (let i = 0; i < playedMoves.length; i++) {
        console.log(playedMoves[i]);
    }
}

/**
 * Retorna cual es el rival
 * @param {Matrix} board
 */
function rival(id_Agent) {
    return id_Agent == 1 ? 2 : 1;
}

//TODO
function hashNodeToId(node) {
    let board = node.board;
    let hashId = '';
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            let num = board[i][j];
            hashId = hashId.concat(num.toString(10));
        }
    }
    return hashId;
}

//TODO
function avoidRepeatedState(node, hash) {
    let hashId = hashNodeToId(node);
    //console.log(hashNum);
    //console.log(isHashRepeated(node, hashNum));
    if (hash.includes(hashId)) {
        return false;
    }
    hash.unshift(hashId);
    //console.log(hash);
    return true;
}

/**
 * Da un valor a un board
 */
function heuristica(board, id_Agent) {
    let result = 0;
    let size = board.length;
    let centro = Math.round(size / 2);
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] == parseInt(id_Agent, 10)) {
                //console.log('encontre un 1 en: ',k,j)
                if (k < centro) {
                    result = result + k + 1;
                } else result = result + size - k;

                if (j < centro) {
                    result = result + j + 1;
                } else result = result + size - j;
                //console.log('heuristica de: ',k,j,'es: ',result)
            }
        }
    }
    return result;
}

/**
 * Copia un board en un clipboard (muy original)
 */

function copyBoard(clipboard, board) {
    for (let i = 0; i < board.length; i++) {
        clipboard.push(board[i].slice());
    }
}

/**
 * Funcion minimax que espera un nodo PAPAPAPAPAPA, osea el papa conoce a los hijos
 */
function minimax(node, limite, minMax, id_Agent) {
    let value = 0;
    if ((limite = 0 || node.children[0] == null)) {
        //console.log('valor de la hoja: ',heuristica(node.board, id_Agent))
        return heuristica(node.board, id_Agent);
    }
    if (minMax == 'MAX') {
        value = -infinito;
        for (let i = 0; i < node.children.length; i++) {
            //console.log('evaluando: ',node.children[i])
            value = Math.max(
                value,
                minimax(node.children[i], limite - 1, 'MIN', id_Agent)
            );
            node.utility = value;
        }
        return value;
    } else {
        value = infinito;
        for (let i = 0; i < node.children.length; i++) {
            //console.log('evaluando: ',node.children[i])

            value = Math.min(
                value,
                minimax(node.children[i], limite - 1, 'MAX', id_Agent)
            );
            node.utility = value;
        }
        return value;
    }
}

/**
 * Crea un Nodo con la nueva implementacion
 */
function crearHijo(type, mown, utility, board, action) {
    let node = {
        type: type,
        mown: -mown,
        utility: -utility,
        board: board,
        action: action,
    };
    return node;
}

/**
 * Dado el nodo padre, busca en sus primeros hijos cual es el que coicide con el valor maximo y retorna su accion
 * @param {Matrix} board
 */

function changeType(type) {
    type == 'MAX' ? 'MIN' : 'MAX';
}

function fijkstra(board) {
    // false dijkstra
    let available = getHexAt(board, 0);
    let length = available.length;
    let dijkstra = [
        available.splice(Math.round(Math.random() * (length - 1)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 2)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 3)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 4)), 1)[0],
    ];
    return dijkstra;
}

function makeNodos(board, tree, level, id_Agent) {
    let type = changeType(tree[level - 1][0].type);
    let mown = tree[level - 1][0].mown;
    let utility = tree[level - 1][0].utility;
    for (let i = 0; i < tree[level - 1].length; i++) {
        let nodos = fijkstra(tree[level - 1][i].board);
        for (let j = 0; j < nodos.length; j++) {
            let newBoard = [];
            copyBoard(newBoard, board);
            newBoard[nodos[j][0]][nodos[j][1]] = id_Agent;
            tree[level].push(
                crearHijo(type, mown, utility, newBoard, nodos[j])
            );
        }
    }
}
function makeTree(board, limite, id_Agent, root) {
    let tree = [];
    for (let i = 0; i < limite; i++) {
        tree.push([]);
    }

    let level = 0;
    tree[level].push(root);
    level++;
    while (level < limite) {
        makeNodos(board, tree, level, id_Agent);
        level++;
    }
    return tree;
}
