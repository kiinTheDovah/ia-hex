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
            level: 0,
            children: [],
            mown: -infinito,
            utility: -infinito,
            board: board,
            action: null,
        };
        if (nTurn % 2 == 0) {
            // == 0 primer turno // == 1 segundo turno
            let row = prompt('row: ', '0');
            let column = prompt('column: ', '0');
            let play = [row, column];
            console.log('hooman: ', play);
            return play;
        }
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

        //console.log(amplitud(root,this.getID(),4));
        //console.log(minimax(nodoMinmax,2,nodoMinmax.type,this.getID()))
        console.log('Pienso, luego existo...');
        //Se crea el arbol con todo en infinito
        let nodoRaizMinMax = generarArbol(raiz, this.getID(), limite);
        var end = new Date().getTime();
        var time = (end - start) / 1000;
        console.log('time: ', time, 's');
        start = new Date().getTime();
        //Le pasamos el arbol a minimax para que retorne el mejor valor y cambie los infinitos del arbol
        let valorMinimax = minimax(
            nodoRaizMinMax,
            limite,
            nodoRaizMinMax.type,
            agente
        );
        end = new Date().getTime();
        time = (end - start) / 1000;
        console.log('time: ', time, 's');
        //Le pregunta al arbol con utilidad definida cual de sus nodos es igual al minimax
        start = new Date().getTime();
        let jugada = retornarPosition(nodoRaizMinMax, valorMinimax);
        end = new Date().getTime();
        time = (end - start) / 1000;
        console.log('time: ', time, 's');
        console.log(
            'El valor del mejor camino con minimax en ' +
                limite +
                ' niveles sin un hash con una heuristica chafa es: ',
            valorMinimax
        );
        //console.log('arbol generado: ',nodoRaizMinMax);
        console.log('la jugada para ' + agente + ' es: ', jugada);
        //console.log(generarArbol(raiz,this.getID(),limite))

        let move =
            available[Math.round(Math.random() * (available.length - 1))];

        //return [Math.floor(move / board.length), move % board.length];
        return jugada;
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
    switch (id_Agent) {
        case '1':
            return '2';
        case '2':
            return '1';
    }
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
 * Retorna un arbol de la manera {raiz [hijo1 [hijo1.1, hijo1.2], hijo2 []]}
 */

function generarArbol(nodo, id_Agent, limite) {
    let nodoEvaluado = nodo;
    let hash = [];

    if (avoidRepeatedState(nodoEvaluado, hash)) {
        agregarHijos(nodoEvaluado, id_Agent);
    } //else console.log('me salte un nodo')

    if (nodoEvaluado.children[0] == null) {
        console.log('Ningun camino es viable.');
    }
    generarHojas(nodoEvaluado.children, limite, id_Agent, hash);
    //console.log(hash.length)
    return nodo;
}

/**
 * Funcion recursiva que actualiza el array de las hojas del root
 */
function generarHojas(listOfChildren, limite, id_Agent, hash) {
    if (listOfChildren[0] == null) {
        return null;
    }

    if (listOfChildren[0].level == limite) {
        return null;
    } else {
        for (let i = 0; i < listOfChildren.length; i++) {
            //Esto falla si no llega a tener hijos
            agregarHijos(listOfChildren[i], id_Agent);
            //console.log('considerate agregada B)')
            if (listOfChildren[i].children[0] == null) {
                console.log(
                    'Dijkstra() failed: Hay un men sin hijos en el nivel: ',
                    listOfChildren[i].level
                );
            }
            listOfChildren[i].children.push(
                generarHojas(listOfChildren[i].children, limite, hash)
            );
            listOfChildren[i].children.pop();
        }
    }
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
 * Es agregar nodo pero con la nueva implementacion :D
 */
function agregarHijos(nodoEvaluado, id_Agent) {
    let board = nodoEvaluado.board;
    let id_Rival = rival(id_Agent);
    let available = getHexAt(board, 0);
    let dijkstra = [
        available[Math.round(Math.random() * (available.length - 1))],
        available[Math.round(Math.random() * (available.length - 1))],
        available[Math.round(Math.random() * (available.length - 1))],
        available[Math.round(Math.random() * (available.length - 1))],
    ];

    for (let i = 0; i < dijkstra.length; i++) {
        let v_x = dijkstra[i][0];
        let v_y = dijkstra[i][1];

        if (board[v_x][v_y] == 0) {
            let newBoard = [];

            copyBoard(newBoard, board);
            newBoard[v_x][v_y] = id_Agent;
            if (nodoEvaluado.type == 'MAX') {
                nodoEvaluado.children.push(
                    crearHijo(
                        'MIN',
                        nodoEvaluado.level + 1,
                        -nodoEvaluado.mown,
                        -nodoEvaluado.utility,
                        newBoard,
                        [v_x, v_y]
                    )
                );
            } else {
                newBoard[v_x][v_y] = id_Rival;
                nodoEvaluado.children.push(
                    crearHijo(
                        'MAX',
                        nodoEvaluado.level + 1,
                        -nodoEvaluado.mown,
                        -nodoEvaluado.utility,
                        newBoard,
                        [v_x, v_y]
                    )
                );
            }
        }
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
function crearHijo(type, level, mown, utility, board, action) {
    let node = {
        type: type,
        level: level,
        children: [],
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

function retornarPosition(nodo, value) {
    for (let i = 0; i < nodo.children.length; i++) {
        if (nodo.children[i].utility == value) {
            return nodo.children[i].action;
        }
    }
}
