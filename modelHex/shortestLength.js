let board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, '1', 0, 0, 0, '1', '1'],
    [0, 0, '2', '1', '2', 0, 0],
    [0, 0, '1', '2', 0, 0, 0],
    ['1', '1', 0, 0, '2', 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, '2', 0, 0, 0, '2'],
];

let board2 = [
    [0, 0, 0, 0, 0],
    [0, '1', '2', '2', 0],
    ['1', 0, 0, '1', '2'],
    [0, 0, '1', '2', 0],
    [0, '1', '1', 0, '2'],
];

function shortestLength(board, pid) {
    let length = board.length;
    let shortest = 0;
    let paths = [];
    for (let col = 0; col < length; col++) {
        paths.push([]);
        for (let row = 0; row < length; row++) {
            paths[col].push([]);
            if (board[row][col] == pid) {
                paths[row][col] = pid;
                console.log(paths);
            }
        }
    }
}

shortestLength(board, 1);
