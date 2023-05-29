'use strict'


//div {
//   color: transparent;
//   text-shadow: 0 0 0 red;
// }


const GHOST = '👻'
var gGhosts
var gGhostColors = []
var gIntervalGhosts



function createGhost(board) {
    var ghost = {
        id: makeId(),
        location: {
            i: 3,
            j: 3,
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = getGhostHTML(ghost)
}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []

    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    // console.log('gGhosts:', gGhosts)

    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // console.log('ghost.location:', ghost.location)
    const moveDiff = getMoveDiff()
    // console.log('moveDiff:', moveDiff)

    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    // console.log('nextLocation:', nextLocation)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCell:', nextCell)

    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    // hitting a pacman? call gameOver unless power-up active
    if (nextCell === PACMAN && !gIsPowerUp) {
        gameOver()
        return
    }

    // moving from current location:
    // update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location:
    // update the model (save cell contents)
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST

    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    var ghostColor = ghost.color
    return `<span style="color: transparent; text-shadow: 0 4px ${ghostColor}">${GHOST}</span>`
}

function toggleGhostPowerup(ghost) {
    // change the colors to blue
    if (!gIsPowerUp) {
        for (var i = 0; i < gGhosts.length; i++) {
            gGhosts[i].color = gGhostColors[i]
        }

    } else {
        // TODO: Change the colors back to the original ones...
        // TODO: Make a more efficient way to store the ghost colors...
        for (var i = 0; i < gGhosts.length; i++) {
            gGhostColors.push(gGhosts[i].color)
            gGhosts[i].color = 'blue'
            // renderCell(gGhosts.location, gGhosts[i])
        }
    }
}


function getGhostAtLocation(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i &&
            gGhosts[i].location.j === location.j) {
            return gGhosts[i]
        }
    }
    return -1
}

function removeGhost(ghost) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].id === ghost.id) {
            if (ghost.currCellContent === FOOD) {
                updateScore(1)
            }
            gBoard[ghost.location.i][ghost.location.j] = EMPTY
            renderCell(ghost.location, EMPTY)

            // remove ghost from ghosts array and store in a temporary place...
            const ghostDead = gGhosts.splice(i, 1)
            gGhosts.splice(i, 1)

            setTimeout(function() {
                gGhosts.push(ghostDead)
            }, 5000)

            break
        }
    }
}