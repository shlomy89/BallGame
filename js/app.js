var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '📗'
var gBallInterval
var gBoard;
var gGamerPos;
var gBallCounter
var gBallsOnBoard
var gRestart = document.querySelector('.restart')
var gGlueInterval
var isWalking = true

function initGame() {
    gBallCounter = 0
    gBallsOnBoard = 2
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);
    gBallInterval = setInterval(randBalls, 3000)
    gGlueInterval = setInterval(randGlue, 5000)
    gRestart.style.display = 'none'
}

function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)


    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null };

            // Place Walls at edgeֲֲֿs
            if (i === 0 || i === board.length - 1 ||
                j === 0 || j === board[0].length - 1) {
                cell.type = WALL
            }
              //Passages
              if (i === 0 && j === 5 ||
                j === 0 && i === 5 ||
                j === 5 && i === board.length - 1 ||
                j === board[0].length - 1 && i === 5) {
                cell.type = FLOOR
            }
            // Add created cell to The game board
            board[i][j] = cell;

        }
    }

    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)
    board[3][8].gameElement = BALL;
    board[7][4].gameElement = BALL;

    // console.log(board);
    return board;
}


// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {

            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })

            // DONE - change to short if statement
            // if (currCell.type === FLOOR) cellClass += ' floor';
            // else if (currCell.type === WALL) cellClass += ' wall';
            cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;

            // DONE - change to switch case statement
            // if (currCell.gameElement === GAMER) {
            //     strHTML += GAMER_IMG;
            // } else if (currCell.gameElement === BALL) {
            //     strHTML += BALL_IMG;
            // }
            // else if (currCell.gameElement === GLUE) {
            //     strHTML += GLUE_IMG
            // }
            switch (currCell.gameElement) {
                case GAMER:
                    strHTML += GAMER_IMG;
                    break
                case BALL:
                    strHTML += BALL_IMG;
                    break
                case GLUE:
                    strHTML += GLUE_IMG
                    break
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    // console.log('strHTML is:');
    // console.log(strHTML);

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
    if (!isWalking) return

    if (i === -1) i = gBoard.length - 1
    else if (i === gBoard.length) i = 0
    else if (j === -1) j = gBoard[0].length - 1
    else if (j === gBoard[0].length) j = 0


    var targetCell = gBoard[i][j];
    if (targetCell.type === WALL) return;
    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);
    console.log('iAbsDiff:', iAbsDiff);
    console.log('jAbsDiff:', jAbsDiff);
    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || //Row movement
        (jAbsDiff === 1 && iAbsDiff === 0) || //Col movement
        //the passages
        (iAbsDiff === gBoard.length - 1 && jAbsDiff === 0) ||
        (iAbsDiff === 0 && jAbsDiff === gBoard[0].length-1)) {

        if (targetCell.gameElement === BALL) {
            gBallCounter++
            console.log('gBallCounter:', gBallCounter);
            gBallsOnBoard--
            console.log('gBallsOnBoard:', gBallsOnBoard);
            if (gBallsOnBoard === -1) {
                gRestart.style.display = 'block'
                clearInterval(gBallInterval)
            }

        } else if (targetCell.gameElement === GLUE) {
            playSound()
            isWalking = false
            setTimeout(() => isWalking = true, 3000)
        }


        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
    var elH2 = document.querySelector('h2')
    elH2.innerHTML = `Ball Counter: ${gBallCounter}`

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}



function locateEmptyCells() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!(i === 0 || i === gBoard.length - 1 || j === 0 || j === gBoard[0].length - 1)) {
                if (!gBoard[i][j].gameElement) {
                    emptyCells.push({ i, j })
                }
            }
        }
    }

    return emptyCells
}

function randBalls() {
    var emptyCells = locateEmptyCells()
    var randIdx = getRandomInt(0, emptyCells.length - 1)
    var coords = emptyCells[randIdx]
    gBoard[coords.i][coords.j].gameElement = BALL
    if (emptyCells.length < 2) {
        clearInterval(gBallInterval)
    }
    renderBoard(gBoard)
}

function randGlue() {
    var emptyCells = locateEmptyCells()
    var randIdx = getRandomInt(0, emptyCells.length - 1)
    var coords = emptyCells[randIdx]
    if (emptyCells.length < 2) {
        clearInterval(gGlueInterval)
    }
    gBoard[coords.i][coords.j].gameElement = GLUE
    setTimeout(() => {
        if (gBoard[coords.i][coords.j].gameElement !== GAMER) {
            gBoard[coords.i][coords.j].gameElement = null
        } else gBoard[coords.i][coords.j].gameElement = GAMER
    }, 3000)
    renderBoard(gBoard)
}

function gameVictory() {
    if (gBallsOnBoard === 0) {
        clearInterval(gBallInterval)
        clearInterval(gGlueInterval)
    }
}

