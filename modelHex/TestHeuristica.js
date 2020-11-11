let board = [
    //  0 1 2 3 4 5 6
        [1,1,0,0,0,0,0], // 0
         [0,0,0,0,0,0,0], // 1
          [0,0,1,2,0,0,0], // 2
           [0,0,0,0,0,0,0], // 3
            [0,0,0,0,0,0,0], // 4
             [0,0,0,0,0,0,2], // 5
              [0,0,1,0,0,0,0]] // 6


    
    //console.log(checkAround(board,[3,3]))
    //console.log(ourIncludes(checkAround(board,[3,3])[0],6))
    valueBoard(board,'1')
    valueBoard(board,'2')
    /**
     * Retorna cual es el rival.
     * @param {Matrix} board
     */
    function rival(id_Agent) {
        return id_Agent == 1 ? 2 : 1;
    }
    
    /**
     * Returna el valor de una jugada en funcion de las posiciones de las fichas
     * @param {Matrix} board
     * @param {int} id_Agent
     */
    function valueBoard (board = [], id_Agent){
    let valor = 0;               
        switch (id_Agent) {
            case '1':
                let valor_Board_1 = [
                    //  0 1 2 3 4 5 6
                        [4,3,3,3,3,3,4], // 0
                         [1,4,3,4,3,4,1], // 1
                          [1,4,5,5,5,4,1], // 2
                           [1,4,5,6,5,4,1], // 3
                            [1,4,5,5,5,4,1], // 4
                             [1,4,3,4,3,4,1], // 5
                              [4,3,3,3,3,3,4]] // 6
                for(let i = 0;i<board.length - 1;i++){
                    for(let j = 0;j < board[i].length;j++){
                        if(board[i][j]==id_Agent){
                            valor = valor + valor_Board_1[i][j];
                            console.log('leyendo: ', [i,j])
                        }            
                    }        
                }   
                break;

            case '2':
                let valor_Board_2 = [
                    //  0 1 2 3 4 5 6
                        [4,1,1,1,1,1,4], // 0
                         [3,4,4,4,4,4,3], // 1
                          [3,3,5,5,5,3,3], // 2
                           [3,4,5,6,5,4,3], // 3
                            [3,3,5,5,5,3,3], // 4
                             [3,4,4,4,4,4,3], // 5
                              [4,1,1,1,1,1,4]] // 6
                for(let i = 0;i<board.length - 1;i++){
                    for(let j = 0;j < board[i].length;j++){
                        if(board[i][j]==id_Agent){
                            valor = valor + valor_Board_2[i][j];
                            console.log('leyendo: ', [i,j])
                        }            
                    }        
                }                
                break;
        }
    
    console.log('valor de la jugada: ', valor)
    return valor;
    }