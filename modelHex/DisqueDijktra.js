let board = [
    [0,0,0,0,0,0,0],
     [0,'1',0,0,0,'1','1'],
      [0,0,'2','1','2',0,0],
       [0,0,'1','2',0,0,0],
        ['1','1',0,0,'2',0,0],
         [0,0,0,0,0,0,0],
          [0,0,'2',0,0,0,'2']
]

let board2 = [
    [0,0,0,0,0],
     [0,'1','2','2',0],
      ['1',0,0,'1','2'],
       [0,0,'1','2',0],
        [0,'1','1',0,'2']
]


function Dijktra(board,id_Agent){
    //let src=[0,0];//row,colum
    let minPQ=[];
    let visited=[]; //ahora es caminos
    let superMin=[0,999999999999]

    //minPQ.push([src,1]);//[pos,dis,padre]
    switch (id_Agent) {
        case 1:
            for(let i=0;i<board.length;i++){
                //console.log("Paso por el For de src: ", i)
                //Agrego el punto de partida
                let src=[i,0];
                if(board[i][0]==0){
                    minPQ.push([src,1]);
                }else if(board[i][0]==1){
                    minPQ.push([src,0]);
                }else if(board[i][0]==2){
                    //no hace push;
                }

                while(minPQ.length!=0){
                    let min = sacarMin(minPQ);
                    visited.push(min)
                    checkArroun(min,board,minPQ,id_Agent,visited)
                }
                if(visited.length!=0){
                    let fakeMin = shortestWay(id_Agent,board,visited);
                    if(fakeMin[1]<superMin[1]){
                        superMin=fakeMin;
                        visitMin=visited;
                    }
                }
                visited=[];
            }
            break;
        case 2:
            for(let i=0;i<board.length;i++){
                //console.log("Paso por el For de src: ", i)
                //Agrego el punto de partida
                let src=[0,i];
                if(board[0][i]==0){
                    minPQ.push([src,1]);
                }else if(board[0][i]==1){
                    //no hace push;
                }else if(board[0][i]==2){
                    minPQ.push([src,0]);
                }

                while(minPQ.length!=0){
                    let min = sacarMin(minPQ);
                    visited.push(min)
                    checkArroun(min,board,minPQ,id_Agent,visited)
                }
                if(visited.length!=0){
                    let fakeMin = shortestWay(id_Agent,board,visited);
                    if(fakeMin[1]<superMin[1]){
                        superMin=fakeMin;
                        visitMin=visited;
                    }
                }
                visited=[];
            }
            break;
        default:
            console.log('QUe pedo con el id_Agent')
            break;
    }
    return superMin[1];
    //console.log('Pasos Min: ',superMin[1])
    
}

function  sacarMin(minPQ){
    let min=9999999999999;
    let pos = 0;
    for(let i=0;i<minPQ.length;i++){
        let dis = minPQ[i][1];
        if(dis<min){
            min=dis;
            pos=i;
        }
    }
    let aux=minPQ.splice(pos,1);
    //console.log("min: ",aux[0]);
    //console.log(minPQ);
    return aux[0];
}

function checkArroun(min,board,minPQ,id_Agent,visited){
    //console.log(`Llego: ${min}`)
    for(let i=1;i<=6;i++){
        //console.log(`For numero: ${i}`)
        switch (i) {
            case 1:
                //console.log(`Caso ${i}`)
                if(min[0][0]>0){
                    let row = min[0][0]-1;
                    let colum = min[0][1];
                    if(!visitedBefore([row,colum],visited)){
                        agregar(board[row][colum],min[1],[row,colum],minPQ,id_Agent);
                    }//else console.log(`No agrege: [${row},${colum}]`)
                    //No se agregan pasos
                }
                break;
            case 2:
                //console.log(`Caso ${i}`)
                if(min[0][0]>0 && min[0][1]<board.length-1){
                    let row = min[0][0]-1;
                    let colum = min[0][1]+1;
                    if(!visitedBefore([row,colum],visited)){
                        agregar(board[row][colum],min[1],[row,colum],minPQ,id_Agent);
                    }//else console.log(`No agrege: [${row},${colum}]`)
                    //No se agregan pasos
                }
                break;
            case 3:
                //console.log(`Caso ${i}`)
                if(min[0][1]<board.length-1){
                    let row = min[0][0];
                    //console.log("Row: ", row)
                    let colum = min[0][1]+1;
                    //console.log("Colum: ",colum)
                    if(!visitedBefore([row,colum],visited)){
                        agregar(board[row][colum],min[1],[row,colum],minPQ,id_Agent);
                    }//else console.log(`No agrege: [${row},${colum}]`)
                    //No se agregan pasos
                }
                break;
            case 4:
                //console.log(`Caso ${i}`)
                if(min[0][0]<board.length-1){
                    let row = min[0][0]+1;
                    let colum = min[0][1];
                    if(!visitedBefore([row,colum],visited)){
                        agregar(board[row][colum],min[1],[row,colum],minPQ,id_Agent);
                    }//else console.log(`No agrege: [${row},${colum}]`)
                    //No se agregan pasos
                }
                break;
            case 5:
                //console.log(`Caso ${i}`)
                if(min[0][1]>0 && min[0][0]<board.length-1){
                    let row = min[0][0]+1;
                    let colum = min[0][1]-1;
                    if(!visitedBefore([row,colum],visited)){
                        agregar(board[row][colum],min[1],[row,colum],minPQ,id_Agent);
                    }//else console.log(`No agrege: [${row},${colum}]`)
                    //No se agregan pasos
                }
                break;
            case 6:
                //console.log(`Caso ${i}`)
                if(min[0][1]>0){
                    let row = min[0][0];
                    let colum = min[0][1]-1;
                    if(!visitedBefore([row,colum],visited)){
                        agregar(board[row][colum],min[1],[row,colum],minPQ,id_Agent);
                    }//else console.log(`No agrege: [${row},${colum}]`)
                    //No se agregan pasos
                }
                break;
            default:
                break;
        }
    }
}

function agregar(valueNext,dis,nextPos,minPQ,id_Agent){
    switch (valueNext) {
        case 0:
            minPQ.push([nextPos,dis+1])
            break;
        case '1':
            if(id_Agent==1){
                minPQ.push([nextPos,dis])
            }else if(id_Agent==2){
                //no debe agregar el paso
            }else console.log(`Agente loco`);
            break
        case '2':
            if(id_Agent==1){
                //no debe agregar el paso
            }else if(id_Agent==2){
                minPQ.push([nextPos,dis])
            }else console.log(`Agente loco`);
            break
        default:
            console.log(`Que es esto: ${valueNext}`);
            break;
    }
}

function visitedBefore(pos,visited){
    for(let i=0;i<visited.length;i++){
        //console.log(`Row: ${visited[i][0][0]}`)
        //console.log(`Colum: ${visited[i][0][1]}`)
        if(visited[i][0][0]==pos[0]){
            if(visited[i][0][1]==pos[1]){
                //console.log('paso por aqui')
                return true;
            }
        }
    }
    return false;
}

function buscarCamino(posFin,caminos){
    for(let i=0;i<caminos.length;i++){
        if(caminos[i][0][0]==posFin[0]){
            if(caminos[i][0][1]==posFin[1]){
                //console.log("El camino es",caminos[i]);
                return caminos[i];
            }
        }
    }
    //console.log('No se puede llegar al punto: ',posFin)
    return null;
}

function shortestWay(id_Agent,board,caminos){
    let min = [0,9999999999];
    let size=board.length;
    switch (id_Agent) {
        case 1:
            for(let i=0;i<size;i++){
                let way=buscarCamino([i,size-1],caminos);
                //console.log('busco',[i,size-1]);
                if(way!=null){
                    //console.log("dis: ", way[1]);
                    if(way[1]<min[1]){
                        min=way;
                    }
                }
            }
            break;
        case 2:
            for(let i=0;i<size;i++){
                let way=buscarCamino([size-1,i],caminos);
                //console.log('busco',[size-1,i]);
                if(way!=null){
                    //console.log("dis: ", way[1]);
                    if(way[1]<min[1]){
                        min=way;
                    }
                }
            }
            break;
        default:
            console.log('Qque es esto ???')
            break;
    }
    return min;
}

function crearPath(min,visited){
    let path=[];
    let iterativeMin=min;
    while(iterativeMin!=null){
        path.push(iterativeMin[0])
        iterativeMin=buscarCamino(iterativeMin[2],visited)
    }
    return path;
}

//visitedBefore(0,[[[0,0],0],[[1,0],1],[[0,1],1]])
//sacarMin([['pos0',4],['pos1',3],['pos2',2],['pos3',5]])
Dijktra(board,2)


let p1=[1,2,3,4,5]
function prueba(array){
    let pp1=[];
    for(let i=0;i<2;i++){
        if(i==0){
            pp1=array;
        }
        array=[];
    }
    console.log("copia?: ",pp1)
    console.log("Parametro: ",array)
}

//prueba(p1)
//console.log("original: ",p1);