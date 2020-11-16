const Agent = require('ai-agents').Agent;
var infinito = Number.MAX_SAFE_INTEGER;
var lim = 4;
var camMin = 99;
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
        //var start = new Date().getTime();
        let board = this.perception;
        let size = board.length;
        let available = getHexAt(board, 0);
        let nTurn = size * size - available.length;

        let limite = lim;
        let agente = this.getID();

        //Nodo Raiz - Estado inicial
        let raiz = {
            type: 'MAX',
            level: 0,
            children: [],
            utility: -infinito,
            board: board,
            action: null,
        };
        /////    PLAY AS HUMAN VS AI     /////
        /* if (nTurn % 2 == 0) { //let the hooman play
            // == 0 primer turno // == 1 segundo turno
            let row = prompt('row: ', '0');
            let column = prompt('column: ', '0');
            let play = [row, column];
            console.log('hooman: ', play);
            return play;
        } */
        if (nTurn == 0) {
            // First move
            let move = [Math.floor(size / 2) - 1, Math.floor(size / 2)];
            return move;
        } else if (nTurn == 1) {
            // Second move
            let move = [Math.floor(size / 2), Math.floor(size / 2)];
            return move;
        }
        //console.log('Pienso, luego existo...');
        //Se crea el arbol con todo en infinito
        let valorAlpha = alfa_Beta(raiz, limite, -infinito, infinito, agente);

        let jugada = retornarPosition(raiz, valorAlpha);
        //console.log('Arbol generado: ', raiz);
        /* console.log(
            'El valor del mejor camino con alfa-beta en ' +
                limite +
                ' niveles sin un hash es: ',
            valorAlpha
        ); */
        //console.log('La jugada para ' + agente + ' es: ', jugada);

        let move =
            available[Math.round(Math.random() * (available.length - 1))];

        /* var end = new Date().getTime();
        var time = (end - start) / 1000;
        console.log('time: ', time, 's'); */

        return jugada;
    }
}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex (0)
 * or the player id (1 or 2) in the board
 * @param {Array} board
 * @param {Number} pid
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
 * @param {Array2D} board
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
    let length = board.length;
    let valOf0C = 0;
    let valOf1C = 0.2;
    let valOf2C = 1;
    let valOf3C = 0.5;
    let valOf4plusC = -1;

    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (board[i][j] == pid) {
                let around = checkAround(board, [i, j]);
                switch (around[pid].length) {
                    case 0:
                        cells += valOf0C;
                        break;
                    case 1:
                        cells += valOf1C;
                        break;
                    case 2:
                        if (
                            around[pid][0] + 1 == around[pid][1] ||
                            around[pid][0] + 5 == around[pid][1]
                        ) {
                            break;
                        }
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

/**
 * Funcion Heuristica donde llamaremos a las demas funciones que en conjunto darán un valor al estado
 * @param {Matrix} board
 * @param {int} id_Agent
 */
function heuristica(board, id_Agent) {
    let result = 0;
    let puentesVal;
    let connectsVal;
    let winwin;
    let dijk;
    let rid = rival(id_Agent); //rival id

    puentesVal = puentes(board, id_Agent) - puentes(board, rid) / 3;
    connectsVal = countConnects(board, id_Agent) - countConnects(board, rid);
    winwin = Winner(board, id_Agent) - Winner(board, rival(id_Agent));
    dijk =
        10 *
        (8 / (1 + Dijkstra(board, id_Agent)) - 4 / (1 + Dijkstra(board, rid)));

    result = 1 * puentesVal + connectsVal + 4 * dijk;
    if (winwin == 500) {
        let available = getHexAt(board, 0);
        result += winwin + available.length * 1000;
    }
    if (winwin == -500) {
        let available = getHexAt(board, 0);
        result -= winwin + available.length * 1000;
    }
    return result;
}

/**
 * Cuenta la cantidad de puentes en un board.
 * @param {Matrix} board
 * @param {int} id_Agent
 */
function puentes(board = [], id_Agent) {
    let valor = 0;
    let peso = 1;
    let length = board.length;
    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length; j++) {
            if (board[i][j] == id_Agent) {
                try {
                    if (
                        // Hay puente ABAJO a la IZQUIERDA? (equivalente a ARRIBA a la DERECHA)
                        board[i][j - 1] == 0 && //la izquierda está vacía?
                        board[i + 1][j - 1] == 0 && //abajo a la izquierda está vacía?
                        board[i + 1][j - 2] == id_Agent // existe puente abajo a la izquierda?
                    ) {
                        valor += peso;
                        //console.log('Hay un puente a la IZQUIERDA de: ', [i,j], 'es',[i+1,j-2])
                    } else if (
                        // Hay puente ABAJO? (equivalente a ARRIBA)
                        board[i + 1][j] == 0 && // abajo está vacío?
                        board[i + 1][j - 1] == 0 && //abajo a la izquierda está vacío?
                        board[i + 2][j - 1] == id_Agent //hay puente abajo?
                    ) {
                        valor += peso;
                        //console.log('Hay un puente ABAJO de: ', [i,j], 'es',[i+2,j-1])
                    } else if (
                        // Hay puente ABAJO a la DERECHA? (equivalente a ARRIBA a la IZQUIERDA)
                        board[i + 1][j] == 0 && //abajo está vacío?
                        board[i][j + 1] == 0 && //derecha está vacío?
                        board[i + 1][j + 1] == id_Agent //hay puente abajo a la derecha?
                    ) {
                        valor += peso;
                        //console.log('Hay un puente a la DERECHA de: ', [i,j],'es',[i+1],',',[j+1])
                    }
                } catch (e) {}
            }
        }
    }
    //console.log('numero de puentes: ', valor)
    if (valor > 2) {
        valor = 2;
    }
    return valor;
}

/**
 * Genera el arbol por amplitud. Hace una preevaluacion del arbol con minimax.
 * @param {Object} nodo
 * @param {int} id_Agent
 * @param {int} limite
 */
function generarArbol(nodo, id_Agent, limite) {
    agregarHijos(nodo, id_Agent, false);
    generarHojas(nodo.children, limite, id_Agent, false);
}

/**
 * Crea los hijos de manera recursiva hasta un nivel dado.
 * @param {Array} listOfChildren
 * @param {Number} limite
 * @param {String} id_Agent
 * @param {Boolean} fal
 */
function generarHojas(listOfChildren, limite, id_Agent, fal) {
    if (listOfChildren[0] == null) {
        return null;
    }

    if (listOfChildren[0].level == limite) {
        return null;
    } else {
        for (let i = 0; i < listOfChildren.length; i++) {
            //Esto falla si no llega a tener hijos
            agregarHijos(listOfChildren[i], id_Agent, fal);

            listOfChildren[i].children.push(
                generarHojas(listOfChildren[i].children, limite, id_Agent, fal)
            );
            listOfChildren[i].children.pop();
        }
    }
}

/**
 * Crea una copia de un array 2D en clipboard
 * @param {Array} clipboard
 * @param {Array} board
 * @param {Array} pos
 * @param {string} id_Agent
 */
function copyBoard(clipboard, board, pos, id_Agent) {
    let length = board.length;
    for (let i = 0; i < length; i++) {
        clipboard.push([]);
        for (let j = 0; j < length; j++) {
            /* if (board[i][j] != 0) {
                clipboard[i][j] = board[i][j];
            } */
            if (i == pos[0] && j == pos[1]) {
                clipboard[i].push(id_Agent);
            } else clipboard[i].push(board[i][j]);
        }
        //clipboard.push(board[i].slice());
    }
}

/**
 * Agrega los hijos del nodo enviado en su parametro children
 * @param {Object} nodoEvaluado
 * @param {String} id_Agent
 * @param {Boolean} tru
 */
function agregarHijos(nodoEvaluado, id_Agent, tru) {
    let board = nodoEvaluado.board;
    let id_Rival = rival(id_Agent);

    //Cuando tru es falso hace referencia al filter creando un arbol
    if (!tru) {
        let availab = getHexAt(board, 0);
        for (let i = 0; i < availab.length; i++) {
            let row = availab[i][0];
            let col = availab[i][1];

            if (board[row][col] == 0) {
                let newBoard = [];
                if (nodoEvaluado.type == 'MAX') {
                    copyBoard(newBoard, board, [row, col], id_Agent);
                    nodoEvaluado.children.push(
                        crearHijo(
                            'MIN',
                            nodoEvaluado.level + 1,
                            -nodoEvaluado.utility,
                            newBoard,
                            [row, col]
                        )
                    );
                } else {
                    copyBoard(newBoard, board, [row, col], id_Rival);
                    nodoEvaluado.children.push(
                        crearHijo(
                            'MAX',
                            nodoEvaluado.level + 1,
                            -nodoEvaluado.utility,
                            newBoard,
                            [row, col]
                        )
                    );
                }
            }
        }
        return;
    }
    let dijkstra = filter(board, id_Agent);

    //Lee los nodos de dijkstra y agrega los hijos al nodo padre
    for (let i = 0; i < dijkstra.length; i++) {
        let row = dijkstra[i].action[0];
        let col = dijkstra[i].action[1];

        if (board[row][col] == 0 && Winner(board, id_Agent) == 0) {
            let newBoard = [];

            if (nodoEvaluado.type == 'MAX') {
                copyBoard(newBoard, board, [row, col], id_Agent);
                nodoEvaluado.children.push(
                    crearHijo(
                        'MIN',
                        nodoEvaluado.level + 1,
                        -nodoEvaluado.utility,
                        newBoard,
                        [row, col]
                    )
                );
            } else {
                copyBoard(newBoard, board, [row, col], id_Rival);
                nodoEvaluado.children.push(
                    crearHijo(
                        'MAX',
                        nodoEvaluado.level + 1,
                        -nodoEvaluado.utility,
                        newBoard,
                        [row, col]
                    )
                );
            }
        }
    }
    id_Rival = rival(id_Rival);
}

/**
 * Funcion minimax, dado un nodo retorna el valor de la mejor heuristica en sus hojas.
 * @param {Object} node
 * @param {number} limite
 * @param {Boolean} minoMax
 * @param {string} id_Agent
 */
function minimax(node, limite, minoMax, id_Agent) {
    let value = 0;
    if ((limite = 0 || node.children[0] == null)) {
        let puentesVal;
        let connectsVal;
        let valueBo;
        let winwin;
        let rid = rival(id_Agent);
        let board = node.board;

        puentesVal = puentes(board, id_Agent) - puentes(board, rid) / 3;
        connectsVal =
            countConnects(board, id_Agent) - countConnects(board, rid);
        valueBo = valueBoard(board, id_Agent) - valueBoard(board, rid);
        winwin = Winner(board, id_Agent) - Winner(board, rid);

        let result = 2 * puentesVal + connectsVal + valueBo;
        if (winwin == 500) {
            let available = getHexAt(board, 0);
            result += winwin + available.length * 1000;
        } else if (winwin == -500) {
            let available = getHexAt(board, 0);
            result -= winwin + available.length * 1000;
        }
        node.utility = result;
        return node.utility;
    }
    if (minoMax == 'MAX') {
        value = -infinito;
        for (let i = 0; i < node.children.length; i++) {
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
 * Poda alfa beta, retorna el mejor valor de la heuristica de sus hojas a la vez que crea el arbol eliminando nodos
 * que nunca recorrerá.
 * @param {Object} node
 * @param {Number} limite
 * @param {Number} a
 * @param {Number} b
 * @param {string} id_Agent
 */
function alfa_Beta(node, limite, a, b, id_Agent) {
    if (node.level < lim) {
        agregarHijos(node, id_Agent, true);
    }
    if ((limite = 0 || node.children[0] == null)) {
        let utilidad = heuristica(node.board, id_Agent);
        node.utility = utilidad;
        return utilidad;
    }
    if (node.type == 'MAX') {
        for (let i = 0; i < node.children.length; i++) {
            a = Math.max(
                a,
                alfa_Beta(node.children[i], limite - 1, a, b, id_Agent)
            );
            node.utility = a;
            if (b <= a) {
                break;
            }
        }
        return a;
    } else {
        for (let i = 0; i < node.children.length; i++) {
            b = Math.min(
                b,
                alfa_Beta(node.children[i], limite - 1, a, b, id_Agent)
            );
            node.utility = b;
            if (b <= a) {
                break;
            }
        }
        return b;
    }
}

/**
 * Crea un hijo basado en el padre
 * @param {String} type
 * @param {Number} level
 * @param {Number} utility
 * @param {Array} board
 * @param {Array} action
 */
function crearHijo(type, level, utility, board, action) {
    let node = {
        type: type,
        level: level,
        children: [],
        utility: utility,
        board: board,
        action: action,
    };
    return node;
}

/**
 * Dado el nodo padre, busca en sus primeros hijos cual es el que coicide con el valor maximo y retorna su accion
 * @param {Object} nodo
 * @param {Array} value
 */
function retornarPosition(nodo, value) {
    for (let i = 0; i < nodo.children.length; i++) {
        if (nodo.children[i].utility == value) {
            return nodo.children[i].action;
        }
    }
}

/**
 * Preevalua todos los nodos disponibles una vez, generando un arbol por amplitud y minimax.
 * Finalmente, retorna un filtro con los mejores nodos hijos.
 * @param {Array2D} board
 * @param {string} agente
 */
function filter(board, agente) {
    let starLim = 2;
    let staRoot = {
        type: 'MAX',
        level: 0,
        children: [],
        utility: -infinito,
        board: board,
        action: null,
    };

    generarArbol(staRoot, agente, starLim);

    minimax(staRoot, starLim, staRoot.type, agente);

    let orderedChild = [];
    orderedChild.push(staRoot.children[0]);

    for (let i = 1; i < staRoot.children.length; i++) {
        for (let j = 0; j < orderedChild.length; j++) {
            if (staRoot.children[i].utility >= orderedChild[j].utility) {
                orderedChild.splice(j, 0, staRoot.children[i]);
                break;
            }
            if (j == orderedChild.length - 1) {
                orderedChild.push(staRoot.children[i]);
                break;
            }
        }
    }
    let bestChilds = [];
    let leng = 8;
    if (8 > orderedChild.length) {
        leng = orderedChild.length;
    }
    for (let i = 0; i < leng; i++) {
        bestChilds.push(orderedChild[i]);
    }
    return bestChilds;
}

/**
 * Returna el valor de una jugada en funcion de las posiciones de las fichas
 * @param {Matrix} board
 * @param {Number} id_Agent
 */
function valueBoard(board = [], id_Agent) {
    let valor = 0;
    switch (id_Agent) {
        case '1':
            let valor_Board_1 = [
                //  0 1 2 3 4 5 6
                [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0], // 0
                [1.1, 0.8, 0.3, 0.0, 1.0, 1.4, 1.4], // 1
                [1.2, 1.0, 1.0, 1.2, 1.5, 1.4, 1.3], // 2
                [1.4, 1.5, 1.4, 2.0, 1.4, 1.5, 1.4], // 3
                [1.3, 1.4, 1.5, 1.2, 1.0, 1.0, 1.2], // 4
                [1.4, 1.4, 1.0, 0.0, 0.3, 0.8, 1.1], // 5
                [2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0], //6
            ];
            for (let i = 0; i < board.length - 1; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] == id_Agent) {
                        valor = valor + valor_Board_1[i][j];
                    }
                }
            }
            break;

        case '2':
            let valor_Board_2 = [
                //  0   1    2    3    4    5    6
                [2.0, 1.4, 1.3, 1.4, 1.2, 1.1, 1.0], // 0
                [0.0, 1.4, 1.4, 1.5, 1.0, 0.8, 0.0], // 1
                [0.0, 1.0, 1.5, 1.4, 1.0, 0.3, 0.0], // 2
                [0.0, 0.0, 1.2, 2.0, 1.2, 0.0, 0.0], // 3
                [0.0, 0.3, 1.0, 1.4, 1.5, 1.0, 0.0], // 4
                [0.0, 0.8, 1.0, 1.5, 1.4, 1.4, 0.0], // 5
                [1.0, 1.1, 1.2, 1.4, 1.3, 1.4, 2.0], // 6
            ];
            for (let i = 0; i < board.length - 1; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] == id_Agent) {
                        valor = valor + valor_Board_2[i][j];
                    }
                }
            }
            break;
    }
    //console.log('valor de la jugada: ', valor)
    return valor;
}
/**
 * Returna el valor de una jugada en funcion de si gano o perdio
 * @param {Matrix} board
 * @param {int} id_Agent
 */
function Winner(board = [], id_Agent) {
    let hash = [];
    let valor = 0;
    let peso = 500;
    switch (id_Agent) {
        case '1':
            for (let i = 0; i < board.length - 1; i++) {
                if (board[i][0] == id_Agent) {
                    hash.push(i * 10 + 0);
                    if (contarCamino(board, [i, 0], hash, id_Agent)) {
                        valor = peso;
                    }
                }
            }
            break;

        case '2':
            for (let i = 0; i < board.length - 1; i++) {
                if (board[0][i] == id_Agent) {
                    hash.push(0 * 10 + i);
                    if (contarCamino(board, [0, i], hash, id_Agent)) {
                        valor = peso;
                    }
                }
            }
            break;
    }
    //console.log('valor de la jugada: ', valor)
    return valor;
}

/**
 * Retorna un booleano true si cruza el tablero de lado a lado dependiendo del id_Agent
 * @param {Matrix} board
 * @param {Array} pos
 * @param {Array} hash
 * @param {Number} id_Agent
 */
function contarCamino(board, pos, hash = [], id_Agent) {
    let around = checkAround(board, pos);
    let bool = false;
    let pos_id = 0;
    let index_id = 0;

    //Esto cambia la manera de buscar en el array checkAround dependiendo del agente
    if (id_Agent == '1') {
        pos_id = 1;
        index_id = 1;
    } else {
        pos_id = 0;
        index_id = 2;
    }

    //En sintesis esto busca si hay algun camino por alguna parte y si lo encuentra retorna true
    if (pos[pos_id] == board.length - 1) {
        //console.log('llegué al final')
        bool = true;
    }
    for (let i = 0; i < around[index_id].length && bool != true; i++) {
        switch (around[index_id][i]) {
            case 0: //UP
                if (!hash.includes((pos[0] - 1) * 10 + pos[1])) {
                    hash.push((pos[0] - 1) * 10 + pos[1]);
                    bool =
                        bool ||
                        contarCamino(
                            board,
                            [pos[0] - 1, pos[1]],
                            hash,
                            id_Agent
                        );
                }
                break;
            case 1: //UP-RIGHT
                if (!hash.includes((pos[0] - 1) * 10 + (pos[1] + 1))) {
                    hash.push((pos[0] - 1) * 10 + (pos[1] + 1));
                    bool =
                        bool ||
                        contarCamino(
                            board,
                            [pos[0] - 1, pos[1] + 1],
                            hash,
                            id_Agent
                        );
                }
                break;
            case 2: //RIGHT
                if (!hash.includes(pos[0] * 10 + (pos[1] + 1))) {
                    hash.push(pos[0] * 10 + (pos[1] + 1));
                    bool =
                        bool ||
                        contarCamino(
                            board,
                            [pos[0], pos[1] + 1],
                            hash,
                            id_Agent
                        );
                }
                break;
            case 3: //DOWN
                if (!hash.includes((pos[0] + 1) * 10 + pos[1])) {
                    hash.push((pos[0] + 1) * 10 + pos[1]);
                    bool =
                        bool ||
                        contarCamino(
                            board,
                            [pos[0] + 1, pos[1]],
                            hash,
                            id_Agent
                        );
                }
                break;
            case 4: //DOWN-LEFT
                if (!hash.includes((pos[0] + 1) * 10 + (pos[1] - 1))) {
                    hash.push((pos[0] + 1) * 10 + (pos[1] - 1));
                    bool =
                        bool ||
                        contarCamino(
                            board,
                            [pos[0] + 1, pos[1] - 1],
                            hash,
                            id_Agent
                        );
                }
                break;
            case 5: //LEFT
                if (!hash.includes(pos[0] * 10 + (pos[1] - 1))) {
                    hash.push(pos[0] * 10 + (pos[1] - 1));
                    bool =
                        bool ||
                        contarCamino(
                            board,
                            [pos[0], pos[1] - 1],
                            hash,
                            id_Agent
                        );
                }
                break;
            default:
                break;
        }
    }
    return bool;
}

/**
 * Calcula el camino mas corto, retorna la cantidad de pasos minimos para ganar.
 * @param {Array} board
 * @param {String} id_Agent
 */
function Dijkstra(board, id_Agent) {
    camMin = 99;
    let minPQ = [];
    let visited = [];
    let superMin = [0, 999999999999];

    switch (id_Agent) {
        case '1':
            for (let i = 0; i < board.length - 1; i++) {
                if (!board[i].includes('1')) {
                    continue;
                }
                //Agrego el punto de partida
                let src = [i, 0];
                if (board[i][0] == 0) {
                    minPQ.push([src, 1]);
                } else if (board[i][0] == 1) {
                    minPQ.push([src, 0]);
                } else if (board[i][0] == 2) {
                    //no hace push;
                }

                while (minPQ.length != 0) {
                    let min = sacarMin(minPQ);
                    visited.push(min);
                    checkArroun(min, board, minPQ, id_Agent, visited);
                }
                if (visited.length != 0) {
                    let fakeMin = shortestWay(id_Agent, board, visited);
                    if (fakeMin[1] < superMin[1]) {
                        superMin = fakeMin;
                    }
                }
                visited = [];
            }
            break;
        case '2':
            for (let i = 2; i < board.length - 2; i++) {
                let aux1 = false;
                for (let j = 0; j < board.length; j++) {
                    if (board[j][i] == '2') {
                        aux1 = true;
                        break;
                    }
                }
                if (!aux1) {
                    continue;
                }
                //Agrego el punto de partida
                let src = [0, i];
                if (board[0][i] == 0) {
                    minPQ.push([src, 1]);
                } else if (board[0][i] == 1) {
                    //no hace push;
                } else if (board[0][i] == 2) {
                    minPQ.push([src, 0]);
                }

                while (minPQ.length != 0) {
                    let min = sacarMin(minPQ);
                    visited.push(min);
                    checkArroun(min, board, minPQ, id_Agent, visited);
                }
                if (visited.length != 0) {
                    let fakeMin = shortestWay(id_Agent, board, visited);
                    if (fakeMin[1] < superMin[1]) {
                        superMin = fakeMin;
                    }
                }
                visited = [];
            }
            break;
    }
    return superMin[1];
}

/**
 * Retorna el valor minimo de un array
 * @param {Array} minPQ
 */
function sacarMin(minPQ) {
    let min = 9999999999999;
    let pos = 0;
    for (let i = 0; i < minPQ.length; i++) {
        let dis = minPQ[i][1];
        if (dis < min) {
            min = dis;
            pos = i;
        }
    }
    let aux = minPQ.splice(pos, 1);
    //console.log("min: ",aux[0]);
    //console.log(minPQ);
    return aux[0];
}

/**
 * Busca un camino sin repetir un estado anterior agregando a la cola los nodos visitados.
 * @param {Number} min
 * @param {Array} board
 * @param {Array} minPQ
 * @param {String} id_Agent
 * @param {Array} visited
 */
function checkArroun(min, board, minPQ, id_Agent, visited) {
    for (let i = 1; i <= 6; i++) {
        if (id_Agent == '1') {
            switch (i) {
                case 1: //DERECHA
                    if (min[0][1] < board.length - 1) {
                        let row = min[0][0];
                        let colum = min[0][1] + 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 2: // ARRIBA-DERECHA
                    if (min[0][0] > 0 && min[0][1] < board.length - 1) {
                        let row = min[0][0] - 1;
                        let colum = min[0][1] + 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 3: //ABAJO
                    if (min[0][0] < board.length - 1) {
                        let row = min[0][0] + 1;
                        let colum = min[0][1];
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 4: //ABAJO-IZQUIERDA
                    if (min[0][1] > 0 && min[0][0] < board.length - 1) {
                        let row = min[0][0] + 1;
                        let colum = min[0][1] - 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 5: // ARRIBA
                    if (min[0][0] > 0) {
                        let row = min[0][0] - 1;
                        let colum = min[0][1];
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 6: //IZQUIERDA
                    if (min[0][1] > 0) {
                        let row = min[0][0];
                        let colum = min[0][1] - 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;

                default:
                    break;
            }
        } else {
            switch (i) {
                case 1: //ABAJO
                    if (min[0][0] < board.length - 1) {
                        let row = min[0][0] + 1;
                        let colum = min[0][1];
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 2: //ABAJO-IZQUIERDA
                    if (min[0][1] > 0 && min[0][0] < board.length - 1) {
                        let row = min[0][0] + 1;
                        let colum = min[0][1] - 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 3: //DERECHA
                    if (min[0][1] < board.length - 1) {
                        let row = min[0][0];
                        let colum = min[0][1] + 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 4: //IZQUIERDA
                    if (min[0][1] > 0) {
                        let row = min[0][0];
                        let colum = min[0][1] - 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;
                case 5: // ARRIBA-DERECHA
                    if (min[0][0] > 0 && min[0][1] < board.length - 1) {
                        let row = min[0][0] - 1;
                        let colum = min[0][1] + 1;
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;

                case 6: // ARRIBA
                    if (min[0][0] > 0) {
                        let row = min[0][0] - 1;
                        let colum = min[0][1];
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    }
}

/**
 * Agrega a la cola un estado
 * @param {Number} valueNext
 * @param {Number} dis
 * @param {Number} nextPos
 * @param {Array} minPQ
 * @param {String} id_Agent
 */
function agregar(valueNext, dis, nextPos, minPQ, id_Agent) {
    if (camMin > dis) {
        switch (valueNext) {
            case 0:
                minPQ.push([nextPos, dis + 1]);
                if (camMin > dis + 1) {
                    if (id_Agent == '1') {
                        if (nextPos[1] == 6) {
                            camMin = dis + 1;
                        }
                    }
                    if (id_Agent == '2') {
                        if (nextPos[0] == 6) {
                            camMin = dis + 1;
                        }
                    }
                }
                break;
            case id_Agent:
                minPQ.push([nextPos, dis]);
                if (camMin > dis) {
                    if (id_Agent == '1') {
                        if (nextPos[1] == 6) {
                            camMin = dis;
                        }
                    }
                    if (id_Agent == '2') {
                        if (nextPos[0] == 6) {
                            camMin = dis;
                        }
                    }
                }
            default:
                break;
        }
    }
}

/**
 * Retorna true si es una posicion ya visitada y false de lo contrario
 * @param {Array} pos
 * @param {Array} visited
 */
function visitedBefore(pos, visited) {
    for (let i = 0; i < visited.length; i++) {
        if (visited[i][0][0] == pos[0]) {
            if (visited[i][0][1] == pos[1]) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Busca el camino más corto entre dos nodos
 * @param {Array} posFin
 * @param {Array} caminos
 */
function buscarCamino(posFin, caminos) {
    for (let i = 0; i < caminos.length; i++) {
        if (caminos[i][0][0] == posFin[0]) {
            if (caminos[i][0][1] == posFin[1]) {
                return caminos[i];
            }
        }
    }
    return null;
}

/**
 * Retorna un array con el camino más corto
 * @param {String} id_Agent
 * @param {Array} board
 * @param {Array} caminos
 */
function shortestWay(id_Agent, board, caminos) {
    let min = [0, 9999999999];
    let size = board.length;
    switch (id_Agent) {
        case '1':
            for (let i = 0; i < size; i++) {
                let way = buscarCamino([i, size - 1], caminos);
                if (way != null) {
                    if (way[1] < min[1]) {
                        min = way;
                    }
                }
            }
            break;
        case '2':
            for (let i = 0; i < size; i++) {
                let way = buscarCamino([size - 1, i], caminos);
                if (way != null) {
                    if (way[1] < min[1]) {
                        min = way;
                    }
                }
            }
            break;
        default:
            console.log('shortestWay() failed: not valid id_Agent');
            break;
    }
    return min;
}
