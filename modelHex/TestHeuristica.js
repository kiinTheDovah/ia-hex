let board = [
    //  0 1 2 3 4 5 6
        [1,1,0,0,2,0,0], // 0
         [0,0,0,0,2,0,0], // 1
          [0,0,1,2,2,0,0], // 2
           [0,0,0,0,2,1,0], // 3
            [0,0,1,1,1,1,0], // 4
             [1,1,0,2,1,0,0], // 5
              [0,0,1,2,1,1,1]] // 6


    
    //console.log(checkAround(board,[3,3]))
    //console.log(ourIncludes(checkAround(board,[3,3])[0],6))
    //Winner(board,'1')
    var start = new Date().getTime();
    console.log('heuristica para 1',Winner(board,'1'))
    console.log('heuristica para 2',Winner(board,'2'))
    var end = new Date().getTime();
    var time = (end - start) / 1000;
        
    console.log('time: ', time, 's');
    
    /**
     * Retorna cual es el rival.
     * @param {Matrix} board
     */
    function rival(id_Agent) {
        return id_Agent == 1 ? 2 : 1;
    }
    
    /**
     * Returna el valor de una jugada en funcion de si gano o perdio
     * @param {Matrix} board
     * @param {int} id_Agent
     */
    function Winner (board = [], id_Agent){
    let hash = []
    let valor = 0;
    let peso = 500;               
        switch (id_Agent) {
            case '1':
                for(let i = 0;i<board.length - 1;i++){
                    if(board[i][0]==id_Agent){
                        hash.push(i*10+0);
                        if (contarCamino(board,[i,0],hash,id_Agent)){
                            valor = peso;
                        }
                        //console.log(hash)
                    }        
                }   
                break;

            case '2':
                for(let i = 0;i<board.length - 1;i++){
                    if(board[0][i]==id_Agent){
                        hash.push(0*10+i);
                        if (contarCamino(board,[0,i],hash,id_Agent)){
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
    function contarCamino(board,pos,hash=[],id_Agent){
        let around = checkAround(board,pos)
        let bool = false;
        let pos_id = 0;
        let index_id = 0;

        //Esto cambia la manera de buscar en el array checkAround dependiendo del agente
        if(id_Agent == '1'){
            pos_id = 1;
            index_id = 1;
        }else {
            pos_id = 0; 
            index_id = 2;
        }

        //En sintesis esto busca si hay algun camino por alguna parte y si lo encuentra retorna true
        if(pos[pos_id] == board.length-1){
            //console.log('llegué al final')
            bool = true;
        }
        for(let i = 0;i<around[index_id].length && bool != true;i++){
            switch (around[index_id][i]) {
                case 0://UP                            
                    if(!hash.includes((pos[0]-1)*10+pos[1])){
                        hash.push((pos[0]-1)*10+pos[1]);
                        bool = bool || contarCamino(board,[(pos[0]-1),pos[1]],hash,id_Agent);                                
                    }
                    break;
                case 1://UP-RIGHT                            
                    if(!hash.includes((pos[0]-1)*10+(pos[1]+1))){
                        hash.push((pos[0]-1)*10+(pos[1]+1));
                        bool = bool || contarCamino(board,[pos[0]-1,pos[1]+1],hash,id_Agent);   
                    }
                    break;
                case 2://RIGHT                            
                    if(!hash.includes(pos[0]*10+(pos[1]+1))){
                        hash.push(pos[0]*10+(pos[1]+1));
                        bool = bool || contarCamino(board,[pos[0],pos[1]+1],hash,id_Agent);   
                    }
                    break;
                case 3://DOWN                            
                    if(!hash.includes((pos[0]+1)*10+pos[1])){
                        hash.push((pos[0]+1)*10+pos[1]);
                        bool = bool || contarCamino(board,[pos[0]+1,pos[1]],hash,id_Agent);   
                    }
                    break;
                case 4://DOWN-LEFT                            
                    if(!hash.includes((pos[0]+1)*10+(pos[1]-1))){
                        hash.push((pos[0]+1)*10+(pos[1]-1));
                        bool = bool || contarCamino(board,[pos[0]+1,pos[1]-1],hash,id_Agent);   
                    }
                    break;
                case 5://LEFT                            
                    if(!hash.includes(pos[0]*10+(pos[1]-1))){
                        hash.push(pos[0]*10+(pos[1]-1));
                        bool = bool || contarCamino(board,[pos[0],pos[1]-1],hash,id_Agent);   
                    }
                    break;            
                default:
                    break
            }            
        }
        return bool;
    }

    /**
     * Revisa los valores que tiene al rededor un nodo retornando u array con estos, el primero para los 0, el segundo para 1 y el tercero para 2
     * 0: arriba
     * 1: arriba derecha
     * 2: derecha
     * 3: abajo
     * 4: abajo izquierda
     * 5: izquierda
     * */

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