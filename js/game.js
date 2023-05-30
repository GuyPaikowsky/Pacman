'use strict'

const WALL = '#'
const FOOD = '.'
const CHERRY = '🍒'
const POWERUP = '💩' //"power food"
const EMPTY = ' '

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gCherryCount = 0

function onInit() {
    console.log('hello')

    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    setInterval(addRandomCherry, 15000)
    renderBoard(gBoard)
    gGame.isOn = true

    // Hide modal if it is displayed from a previous game
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    // remove the last game's high score
    updateScore(0)
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
            // place powerups at corners...
            if (i === 1 && j === size - 2 ||
                j === 1 && i === size - 2 ||
                i === 1 && j === 1        ||
                i === size - 2 && j === size - 2) {
                board[i][j] = POWERUP
            }
        }
    }
    console.log('board:', board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score

    // Each cherry amounts to 10 points and 1 point lost to
    // the food token lost.
    var foodScore = gGame.score - (gCherryCount * 11)
    if (foodScore === 60) {
        gameOver()
    }
}


function gameOver() {
    console.log('Game Over')
    gGame.isOn = false
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, EMPTY)

    // prepare contents of modal to show the result of the game
    var userMessage = document.querySelector('.user-msg')
    userMessage.innerText = (gGame.score === 60) ? 'You Won!' : 'You Lost!'

    // Show modal and allow the option to restart
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'

    gGame.score = 0
}

function addRandomCherry() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j] === FOOD || gBoard[i][j] === null) {
                emptyCells.push({i: i, j: j})
            }
        }
    }
    // console.log(emptyCells)
    var randomCell = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
    gBoard[randomCell.i][randomCell.j] = CHERRY

    renderCell(randomCell, CHERRY)
}


// function findEmptyCells() {
//     var emptyCells = []
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard.length; j++) {
//             if (gBoard[i][j] === FOOD || gBoard[i][j] === null) {
//                 emptyCells.push({i: i, j: j})
//             }
//         }
//     }
//     var randomCell = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
//
//     return randomCell
// }