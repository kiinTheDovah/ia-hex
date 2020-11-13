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
        var start = new Date().getTime();
        let board = this.perception;
        let size = board.length;
        let available = getHexAt(board, 0);
        let nTurn = size * size - available.length;

        let limite = lim;
        /* if (available.length > 20) {
            limite = 5;
        } else {
            limite = 4;
        } */
        //console.log('limite', limite);
        let agente = this.getID();

        let raiz = {
            type: 'MAX',
            level: 0,
            children: [],
            utility: -infinito,
            board: board,
            action: null,
        };
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
            //console.log('el turno del agente: ',this.getID())
            let move = [Math.floor(size / 2), Math.floor(size / 2) - 1];
            /* move =
                available[Math.round(Math.random() * (available.length - 1))]; */
            return move;
        } else if (nTurn == 1) {
            //console.log('el turno del agente: ',this.getID())
            let move = [Math.floor(size / 2), Math.floor(size / 2)];
            /* move =
                available[Math.round(Math.random() * (available.length - 1))]; */
            return move;
        }
        //console.log(amplitud(root,this.getID(),4));
        //console.log(minimax(nodoMinmax,2,nodoMinmax.type,this.getID()))
        console.log('Pienso, luego existo...');
        //Se crea el arbol con todo en infinito

        let valorAlpha = alfa_Beta(raiz, limite, -infinito, infinito, agente);

        //Le pasamos el arbol a minimax para que retorne el mejor valor y cambie los infinitos del arbol
        /*
        //ESTE COMENTARIO ES DEL MINIMAX
        let valorMinimax = minimax(
            nodoRaizMinMax,
            limite,
            nodoRaizMinMax.type,
            agente
        );
        //Le pregunta al arbol con utilidad definida cual de sus nodos es igual al minimax
        let jugada = retornarPosition(nodoRaizMinMax, valorMinimax);

        console.log(
            'El valor del mejor camino con minimax en ' +
                limite +
                ' niveles sin un hash con una heuristica chafa es: ',
            valorMinimax
        );
             
        //console.log(generarArbol(raiz,this.getID(),limite))
        */
        //console.log('arbol generado: ', nodoRaizMinMax);

        //////      ESTE COMENTARIO ES DEL ALFA     //////
        /* let valorAlpha = alfa_Beta(
            nodoRaizMinMax,
            limite,
            -infinito,
            infinito,
            agente
        ); */
        let jugada = retornarPosition(raiz, valorAlpha);
        //console.log('Arbol generado: ', raiz);
        console.log(
            'El valor del mejor camino con alfa-beta en ' +
                limite +
                ' niveles sin un hash es: ',
            valorAlpha
        );
        //console.log('La jugada para ' + agente + ' es: ', jugada);
        //////      ESTE COMENTARIO ES DEL ALFA     //////
        let move =
            available[Math.round(Math.random() * (available.length - 1))];

        var end = new Date().getTime();
        var time = (end - start) / 1000;
        console.log('time: ', time, 's');

        //return [Math.floor(move / board.length), move % board.length];
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
    /* let playerChips = getHexAt(board, 1);
    let rid = rival(pid); //rival id */
    let length = board.length;
    let valOf0C = 0;
    let valOf1C = 0;
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
    let size = board.length;
    let centro = Math.round(size / 2);
    let puentesVal;
    let connectsVal;
    let valueBo;
    let winwin;
    let dijk;
    let rid = rival(id_Agent); //rival id

    puentesVal = puentes(board, id_Agent) - puentes(board, rid) / 3;
    connectsVal = countConnects(board, id_Agent) - countConnects(board, rid);
    valueBo = valueBoard(board, id_Agent) - valueBoard(board, rival(id_Agent));
    winwin = Winner(board, id_Agent) - Winner(board, rival(id_Agent));
    dijk =
        10 *
        (8 / (1 + Dijktra(board, id_Agent)) - 4 / (1 + Dijktra(board, rid)));

    result = 1 * puentesVal + connectsVal + 4 * dijk; // //+ valueBo;
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
    //}, type){
    let valor = 0;
    let peso = 1;
    let length = board.length;
    let rid = rival(id_Agent); //rival id
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
 * Retorna un arbol de la manera {raiz [hijo1 [hijo1.1, hijo1.2], hijo2 []]}
 * @param {Object} nodo
 * @param {int} id_Agent
 * @param {int} limite
 */
function generarArbol(nodo, id_Agent, limite) {
    agregarHijos(nodo, id_Agent, false);
    generarHojas(nodo.children, limite, id_Agent, false);
}

/**
 * Funcion recursiva que actualiza el array de las hojas del root
 */
function generarHojas(listOfChildren, limite, id_Agent, fal) {
    //console.log('listOfChildren', listOfChildren);
    if (listOfChildren[0] == null) {
        return null;
    }

    if (listOfChildren[0].level == limite) {
        return null;
    } else {
        for (let i = 0; i < listOfChildren.length; i++) {
            //Esto falla si no llega a tener hijos
            agregarHijos(listOfChildren[i], id_Agent, fal);
            if (listOfChildren[i].children[0] == null) {
                /* console.log(
                    'Dijkstra() failed: Hay un men sin hijos en el nivel: ',
                    listOfChildren[i].level
                ); */
            }
            listOfChildren[i].children.push(
                generarHojas(listOfChildren[i].children, limite, id_Agent, fal)
            );
            listOfChildren[i].children.pop();
        }
    }
}

/**
 * Copia un board en un clipboard (muy original)
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
 * Es agregar nodo pero con la nueva implementacion :D
 */
function agregarHijos(nodoEvaluado, id_Agent, tru) {
    let board = nodoEvaluado.board;
    //console.log('nodoEvaluado', nodoEvaluado);
    let id_Rival = rival(id_Agent);
    if (!tru) {
        let availab = getHexAt(board, 0);
        for (let i = 0; i < availab.length; i++) {
            //console.log('aqui');
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
    let dijkstra = fijkstra(board, id_Agent);
    //console.log('aqui si llegóooooo', dijkstra);
    //console.log('aqui', dijkstra);
    //console.log('dijkstra.length', dijkstra.length);
    for (let i = 0; i < dijkstra.length; i++) {
        //console.log('aqui');
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
 * Funcion minimax que espera un nodo PAPAPAPAPAPA, osea el papa conoce a los hijos
 */
function minimax(node, limite, minoMax, id_Agent) {
    let value = 0;
    if ((limite = 0 || node.children[0] == null)) {
        //console.log('valor de la hoja: ',heuristica(node.board, id_Agent))
        let puentesVal;
        let connectsVal;
        let valueBo;
        let winwin;
        let rid = rival(id_Agent); //rival id
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
        node.utility = result; //heuristica(node.board, id_Agent);
        return node.utility;
    }
    if (minoMax == 'MAX') {
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
 * Funcion alfa_Beta que espera un nodo PAPAPAPAPAPA, osea el papa conoce a los hijos
 *
 */

function alfa_Beta(node, limite, a, b, id_Agent) {
    if (node.level < lim) {
        agregarHijos(node, id_Agent, true);
    }
    if ((limite = 0 || node.children[0] == null)) {
        //console.log('valor de la hoja: ',heuristica(node.board, id_Agent))
        //console.log('Heuristica: ',node.board)
        //return node.board;
        let utilidad = heuristica(node.board, id_Agent); //, node.type);
        node.utility = utilidad;
        return utilidad;
    }
    if (node.type == 'MAX') {
        for (let i = 0; i < node.children.length; i++) {
            //console.log('evaluando: ',node.children[i])
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
            //console.log('evaluando: ',node.children[i])
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
 * Crea un Nodo con la nueva implementacion
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
 *
 */
function retornarPosition(nodo, value) {
    for (let i = 0; i < nodo.children.length; i++) {
        if (nodo.children[i].utility == value) {
            return nodo.children[i].action;
        }
    }
}

/**
 * Devuelve las primeras 4 posiciones disponibles
 *
 */
function fijkstra(board, agente) {
    //console.log('fijstra');
    // false dijkstra
    let starLim = 1;
    //let available = getHexAt(board, 0);
    //let length = available.length; //return dijkstra;
    let staRoot = {
        type: 'MAX',
        level: 0,
        children: [],
        utility: -infinito,
        board: board,
        action: null,
    };
    //console.log('staRoot.children', staRoot);
    generarArbol(staRoot, agente, starLim);

    //console.log('hay arbol');
    minimax(staRoot, starLim, staRoot.type, agente);
    //console.log('staRoot', staRoot);
    //console.log('minmax?');
    let orderedChild = [];
    orderedChild.push(staRoot.children[0]);
    //console.log('aqui si llegó');

    for (let i = 1; i < staRoot.children.length; i++) {
        //console.log('aqui si llegó');
        /* if (staRoot.children[1] == null) {
            break;
        } */
        for (let j = 0; j < orderedChild.length; j++) {
            //console.log(orderedChild.length);
            /* if (staRoot.children[1] == null) {
                break;
            } */
            //console.log('children', staRoot.children[i]);
            //console.log(j);

            if (staRoot.children[i].utility >= orderedChild[j].utility) {
                orderedChild.splice(j, 0, staRoot.children[i]);
                //console.log('voy a hacer un break');
                break;
            }
            if (j == orderedChild.length - 1) {
                orderedChild.push(staRoot.children[i]);
                //console.log('voy a hacer un break');
                break;
            }
        }
    }
    let bestChilds = [];
    let leng = 8;
    /* if (6 < leng) {
        leng = leng / 2;
    } */
    //console.log('orderedChild', orderedChild);
    for (let i = 0; i < leng; i++) {
        bestChilds.push(orderedChild[i]);
    }
    //console.log('best', bestChilds);
    return bestChilds;
    /* 
        available.splice(Math.round(Math.random() * (length - 1)), 1)[0],
        available.splice(Math.round(Math.random() * (length - 2)), 1)[0],
        for (let i = 0; i < length-37; i++) {
        dijkstra.push(available[i]);
    } */
    /* let dijkstra = [
        available[3],
        available[0],
        available[2],
        available[1],
        available[4],
        available[6],
        available[7],
        available[5],
        available[9],
        available[8],
        available[10],
        available[11],
    ]; */
    //return dijkstra;
    //return available;
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
                [2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
            ]; // 6
            for (let i = 0; i < board.length - 1; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] == id_Agent) {
                        valor = valor + valor_Board_1[i][j];
                        //console.log('leyendo: ', [i,j])
                    }
                }
            }
            break;

        case '2':
            let valor_Board_2 = [
                //  0 1 2 3 4 5 6
                [2.0, 1.4, 1.3, 1.4, 1.2, 1.1, 1.0], // 0
                [0.0, 1.4, 1.4, 1.5, 1.0, 0.8, 0.0], // 1
                [0.0, 1.0, 1.5, 1.4, 1.0, 0.3, 0.0], // 2
                [0.0, 0.0, 1.2, 2.0, 1.2, 0.0, 0.0], // 3
                [0.0, 0.3, 1.0, 1.4, 1.5, 1.0, 0.0], // 4
                [0.0, 0.8, 1.0, 1.5, 1.4, 1.4, 0.0], // 5
                [1.0, 1.1, 1.2, 1.4, 1.3, 1.4, 2.0],
            ]; // 6
            for (let i = 0; i < board.length - 1; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] == id_Agent) {
                        valor = valor + valor_Board_2[i][j];
                        //console.log('leyendo: ', [i,j])
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
                    //console.log(hash)
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
                    //console.log(hash)
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
 * @param {int} id_Agent
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
// TODO: cortar caminos que son más largos que el más corto que he encontrado
function Dijktra(board, id_Agent) {
    camMin = 99;
    //let src=[0,0];//row,colum
    let minPQ = [];
    let visited = []; //ahora es caminos
    let superMin = [0, 999999999999];

    //minPQ.push([src,1]);//[pos,dis,padre]
    switch (id_Agent) {
        case '1':
            for (let i = 0; i < board.length; i++) {
                if (!board[i].includes('1')) {
                    continue;
                }
                //console.log("Paso por el For de src: ", i)
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
            for (let i = 0; i < board.length; i++) {
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

                //console.log("Paso por el For de src: ", i)
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
        default:
            console.log('QUe pedo con el id_Agent');
            break;
    }
    return superMin[1];
    //console.log('Pasos Min: ',superMin[1])
}

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

function checkArroun(min, board, minPQ, id_Agent, visited) {
    //console.log(`Llego: ${min}`)
    for (let i = 1; i <= 6; i++) {
        //console.log(`For numero: ${i}`)
        if (id_Agent == '1') {
            switch (i) {
                case 1: //DERECHA
                    //console.log(`Caso ${i}`)
                    if (min[0][1] < board.length - 1) {
                        let row = min[0][0];
                        //console.log("Row: ", row)
                        let colum = min[0][1] + 1;
                        //console.log("Colum: ",colum)
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 2: // ARRIBA-DERECHA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 3: //ABAJO
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 4: //ABAJO-IZQUIERDA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 5: // ARRIBA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 6: //IZQUIERDA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;

                default:
                    break;
            }
        } else {
            switch (i) {
                case 1: //ABAJO
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 2: //ABAJO-IZQUIERDA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 3: //DERECHA
                    //console.log(`Caso ${i}`)
                    if (min[0][1] < board.length - 1) {
                        let row = min[0][0];
                        //console.log("Row: ", row)
                        let colum = min[0][1] + 1;
                        //console.log("Colum: ",colum)
                        if (!visitedBefore([row, colum], visited)) {
                            agregar(
                                board[row][colum],
                                min[1],
                                [row, colum],
                                minPQ,
                                id_Agent
                            );
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 4: //IZQUIERDA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;
                case 5: // ARRIBA-DERECHA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;

                case 6: // ARRIBA
                    //console.log(`Caso ${i}`)
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
                        } //else console.log(`No agrege: [${row},${colum}]`)
                        //No se agregan pasos
                    }
                    break;

                default:
                    break;
            }
        }
    }
}

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
            /* 
                if (id_Agent == 1) {
                    minPQ.push([nextPos, dis]);
                } else if (id_Agent == 2) {
                    //no debe agregar el paso
                } else console.log(`Agente loco`);
                break;
            case '2':
                if (id_Agent == 1) {
                    //no debe agregar el paso
                } else if (id_Agent == 2) {
                    minPQ.push([nextPos, dis]);
                } else console.log(`Agente loco`);
                break; */
            default:
                //no debe agregar el paso
                break;
        }
    }
}
function visitedBefore(pos, visited) {
    for (let i = 0; i < visited.length; i++) {
        //console.log(`Row: ${visited[i][0][0]}`)
        //console.log(`Colum: ${visited[i][0][1]}`)
        if (visited[i][0][0] == pos[0]) {
            if (visited[i][0][1] == pos[1]) {
                //console.log('paso por aqui')
                return true;
            }
        }
    }
    return false;
}

function buscarCamino(posFin, caminos) {
    for (let i = 0; i < caminos.length; i++) {
        if (caminos[i][0][0] == posFin[0]) {
            if (caminos[i][0][1] == posFin[1]) {
                //console.log("El camino es",caminos[i]);
                return caminos[i];
            }
        }
    }
    //console.log('No se puede llegar al punto: ',posFin)
    return null;
}

function shortestWay(id_Agent, board, caminos) {
    let min = [0, 9999999999];
    let size = board.length;
    switch (id_Agent) {
        case '1':
            for (let i = 0; i < size; i++) {
                let way = buscarCamino([i, size - 1], caminos);
                //console.log('busco',[i,size-1]);
                if (way != null) {
                    //console.log("dis: ", way[1]);
                    if (way[1] < min[1]) {
                        min = way;
                    }
                }
            }
            break;
        case '2':
            for (let i = 0; i < size; i++) {
                let way = buscarCamino([size - 1, i], caminos);
                //console.log('busco',[size-1,i]);
                if (way != null) {
                    //console.log("dis: ", way[1]);
                    if (way[1] < min[1]) {
                        min = way;
                    }
                }
            }
            break;
        default:
            console.log('Qque es esto ???');
            break;
    }
    return min;
}
