'use strict'

const PACMAN = '😀'
var gPacman
var gIsPowerUp = false

function createPacman(board) {
    gPacman = {
        location: {
            i: 7,
            j: 7
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return

    const nextLocation = getNextLocation(ev)
    console.log('nextLocation:', nextLocation)
    if (!nextLocation) return

    const nextCell = gBoard[nextLocation.i][nextLocation.j]
    console.log('nextCell:', nextCell)
    // return if cannot move
    if (nextCell === WALL) return

    if (nextCell === FOOD) {
        updateScore(1)
    }

    if (nextCell === CHERRY) {
        updateScore(10)
        gCherryCount++
    }

    if (nextCell === POWERUP) {
        gIsPowerUp = true
        toggleGhostPowerup(nextCell)
        setTimeout(function() {
            gIsPowerUp = false
            toggleGhostPowerup()
        }, 5000)
    }

    if (nextCell === GHOST && !gIsPowerUp) {
        gameOver()
        return
    } else if (nextCell === GHOST && gIsPowerUp) {
        var ghost = getGhostAtLocation(nextLocation)
        removeGhost(ghost)
    }

    // moving from current location:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // Move the pacman to new location:
    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, PACMAN)
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // console.log('eventKeyboard.code:', eventKeyboard.code)

    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            break
        case 'ArrowDown':
            nextLocation.i++
            break
        case 'ArrowRight':
            nextLocation.j++
            break
        case 'ArrowLeft':
            nextLocation.j--
            break
        default: return null
    }

    return nextLocation
}