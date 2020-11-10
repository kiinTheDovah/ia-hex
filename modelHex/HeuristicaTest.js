let board = [
            [0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,2,1,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,2,0],
            [0,0,0,0,0,0,0]]

puentes(board,1)

//console.log(checkAround(board,[3,3]))
//console.log(ourIncludes(checkAround(board,[3,3])[0],6))

function puentes (board = [], id_Agent){
    let valor = 0;
    for(let i = 0;i<board.length - 1;i++)
    {
        for(let j = 0;j < board[i].length;j++){
            if(board[i][j]!=0){
                valor = valor + 1;
                console.log('leyendo: ', [i,j])
            }            
        }        
    }    
    console.log('numero de puentes: ', valor)
    return valor;
}

/**
 * Recibe un board de 0's,1's,2's una posicion [x,y] y una distancia, retorna un array de 3 posiciones => 0:para los alrededores de 0, 1:para 1 y 2:para 2.
 * 
 * 0 = Arriba.
 * 1 = Arriba Derecha.
 * 2 = Derecha.
 * 3 = Derecha Abajo.
 * 4 = Abajo.
 * 5 = Abajo izquierda.
 * 6 = Izquierda.
 * 7 = Izquierda Arriba.
 */

function checkAround(board, pos) {
    let around = [[], [], []];
    /* console.log('around');
    console.log(around); */
    for (let i = 0; i < 8; i++) {
        switch (i) {
            case 0: //up
                try {
                    around[board[pos[0] - 1][pos[1]]].push(i);
                } catch (error) {                    
                }
                break;
            case 1: //up & right
                try {
                    around[board[pos[0] - 1][pos[1] + 1]].push(i);
                } catch (error) {                    
                }
                break;
            case 2: //right
                try {
                    around[board[pos[0]][pos[1] + 1]].push(i);
                } catch (error) {                    
                }
                break;
            case 3: //right & down
                try {
                    around[board[pos[0] + 1][pos[1] + 1]].push(i);
                } catch (error) {                    
                }
                break;
            case 4: //down
                try {
                    around[board[pos[0] + 1][pos[1]]].push(i);
                } catch (error) {                    
                }
                break;
            case 5: // down & left
                try {
                    around[board[pos[0] + 1][pos[1] - 1]].push(i);
                } catch (error) {                    
                }
                break;
            case 6: //left
                try {
                    around[board[pos[0]][pos[1] - 1]].push(i);
                } catch (error) {                    
                }
                break;
            case 7: //left && up
                try {
                    around[board[pos[0] - dist][pos[1] - dist]].push(i);
                } catch (error) {                    
                }
                break;
        }
    }
    return around;
}

/**
 * Recibe un array y un parametro, retorna si el parametro esta contenido en el array.
 * 
 */

function ourIncludes(array = [],par){
    for (let i = 0;i < array.length;i++){
        if (array[i]==par){
            return true;
        }
    }
    return false;
}