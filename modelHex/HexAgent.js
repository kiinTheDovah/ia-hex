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
        let limite = 3;
        let agente = this.getID();
        let raiz = {
            type: 'MAX',
            mown: -infinito,
            utility: -infinito,
            board: board,
            action: null,
            padre: null,
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
        let fullTree = makeTree(limite, agente, raiz);

        var endMakeTree = new Date().getTime();
        var timeMakeTree = (endMakeTree - start) / 1000;
        console.log('timeMakeTree: ', timeMakeTree, 's');
        console.log('tree: ', fullTree); // this fills the memory
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
function hashNodeToId(board) {
    let hashId = 0;
    let k = 0;
    for (let i = 0; i < board.length; i++) {
        let row = 0;
        for (let j = 0; j < board.length; j++) {
            row += (parseInt(board[i][j]) + 1) * 1.1 ** k;
            //console.log(row);
            k++;
        }
        //row *= k;
        hashId += row;
        //k *= 127;
    }
    //console.log('k', k);
    //console.log(hashId);
    return hashId;
}

/* 1    1232132 * 1
2    3212123
3    1132131
4
5
6
7
 */
//TODO
function avoidRepeatedState(board, hash) {
    let hashId = hashNodeToId(board);
    //console.log(hashNum);
    //console.log(isHashRepeated(node, hashNum));
    for (let i = 0; i < hash.length; i++) {
        if (hash[i] == hashId) {
            return false;
        }
    }
    hash.push(hashId);
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
    let length = board.length;
    for (let i = 0; i < length; i++) {
        /* for (let j = 0; j < length; j++) {
            if (board[i][j] != 0) {
                clipboard[i][j] = board[i][j];
            }
            //clipboard[i].push(board[i][j]);
        } */

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
function crearHijo(type, mown, utility, board, action, padre) {
    let node = {
        type: type,
        mown: -mown,
        utility: -utility,
        board: board,
        action: action,
        padre: padre,
    };
    return node;
}

/**
 * Dado el nodo padre, busca en sus primeros hijos cual es el que coicide con el valor maximo y retorna su accion
 * @param {Matrix} board
 */

function changeType(type) {
    return type == 'MAX' ? 'MIN' : 'MAX';
}

function fijkstra(board) {
    // false dijkstra
    let available = getHexAt(board, 0);
    let length = available.length;
    let dijkstra = []; /* 
        available.splice(Math.round(Math.random() * (length - 1)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 2)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 3)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 4)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 5)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 6)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 7)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 8)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 9)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 10)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 11)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 12)), 1)[0],
    ]; */
    for (let i = 0; i < length; i++) {
        dijkstra.push(available[i]);
    }
    return dijkstra;
}

function makeNodos(tree, level, id_Agent, hash) {
    let type = changeType(tree[level - 1][0].type);
    let mown = tree[level - 1][0].mown;
    let utility = tree[level - 1][0].utility;
    for (let i = 0; i < tree[level - 1].length; i++) {
        let nodos = fijkstra(tree[level - 1][i].board);
        let padre = [level - 1, i];
        for (let j = 0; j < nodos.length; j++) {
            let board = tree[padre[0]][padre[1]].board;
            let newBoard = [
                /* [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0], */
            ];
            copyBoard(newBoard, board);
            newBoard[nodos[j][0]][nodos[j][1]] = id_Agent;
            if (avoidRepeatedState(newBoard, hash)) {
                tree[level].push(
                    crearHijo(type, mown, utility, newBoard, nodos[j], padre)
                );
            }
        }
    }
}
function makeTree(limite, id_Agent, root) {
    let tree = [[]];
    let level = 0;
    tree[level].push(root);
    level++;
    while (level <= limite) {
        console.log('level', level);
        tree.push([]);
        let hash = [];
        makeNodos(tree, level, id_Agent, hash);
        id_Agent = rival(id_Agent);
        //console.log(tree);
        level++;
    }
    return tree;
}
