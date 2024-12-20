//  Stanley Liu
//  Stanley_liu@student.uml.edu
//  Github Username: liu-01987175
// GUI HW5: Scrabble Tile Game

// Data manually imported from pieces.json file
const tileData = [
    { "letter": "A", "value": 1, "amount": 9 },
    { "letter": "B", "value": 3, "amount": 2 },
    { "letter": "C", "value": 3, "amount": 2 },
    { "letter": "D", "value": 2, "amount": 4 },
    { "letter": "E", "value": 1, "amount": 12 },
    { "letter": "F", "value": 4, "amount": 2 },
    { "letter": "G", "value": 2, "amount": 3 },
    { "letter": "H", "value": 4, "amount": 2 },
    { "letter": "I", "value": 1, "amount": 9 },
    { "letter": "J", "value": 8, "amount": 1 },
    { "letter": "K", "value": 5, "amount": 1 },
    { "letter": "L", "value": 1, "amount": 4 },
    { "letter": "M", "value": 3, "amount": 2 },
    { "letter": "N", "value": 1, "amount": 5 },
    { "letter": "O", "value": 1, "amount": 8 },
    { "letter": "P", "value": 3, "amount": 2 },
    { "letter": "Q", "value": 10, "amount": 1 },
    { "letter": "R", "value": 1, "amount": 6 },
    { "letter": "S", "value": 1, "amount": 4 },
    { "letter": "T", "value": 1, "amount": 6 },
    { "letter": "U", "value": 1, "amount": 4 },
    { "letter": "V", "value": 4, "amount": 2 },
    { "letter": "W", "value": 4, "amount": 2 },
    { "letter": "X", "value": 8, "amount": 1 },
    { "letter": "Y", "value": 4, "amount": 2 },
    { "letter": "Z", "value": 10, "amount": 1 }
];

// Used below as inspiration for a few functions
//Source: https://www.geeksforgeeks.org/word-scramble-game-using-javascript/

let playerRack = [];
let totalPoints = 0;

// Creates tile pool
function generateTilePool() {
    const pool = [];
    tileData.forEach(tile => {
        for (let i = 0; i < tile.amount; i++) {
            pool.push({ letter: tile.letter, value: tile.value });
        }
    });
    return pool;
}

// Shuffles tiles
function shuffleTiles(pool) {
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
}

// Draws tiles
function drawTiles(pool, count = 7) {
    return pool.splice(0, count);
}

// Updates rack
function updateRackUI() {
    const rackContainer = document.getElementById('tile-rack');
    rackContainer.innerHTML = '';
    playerRack.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.innerText = tile.letter;
        tileElement.setAttribute('data-value', tile.value);
        tileElement.setAttribute('data-index', index);
        tileElement.draggable = true;
        rackContainer.appendChild(tileElement);

        // Makes the tile draggable
        // Source: https://www.w3schools.com/howto/howto_js_draggable.asp
        $(tileElement).draggable({
            revert: "invalid",
            start: function () {
                $(this).addClass('dragging');
            },
            stop: function () {
                $(this).removeClass('dragging');
            }
        });
    });
}

// Initializes  game
function setupGame() {
    const tilePool = shuffleTiles(generateTilePool());
    playerRack = drawTiles(tilePool);
    totalPoints = 0;
    document.getElementById('totalScore').innerText = totalPoints;
    updateRackUI();
    setupBoardDroppables();
}

// Handles word submission
function submitWord() {
    const boardSlots = $('.boardSlot');
    let currentWord = '';
    let currentScore = 0;

    boardSlots.each(function () {
        const tileLetter = $(this).data('letter');
        const tileValue = $(this).data('value');
        if (tileLetter) {
            currentWord += tileLetter;
            currentScore += tileValue;
        }
    });

    if (currentWord.length < 2) {
        alert('Word must be at least 2 letters long.');
        return;
    }

    totalPoints += currentScore;
    document.getElementById('totalScore').innerText = totalPoints;
    document.getElementById('currentWord').innerText = '';
    document.getElementById('currentScore').innerText = '';

    $('.boardSlot').each(function () {
        $(this).removeData('letter');
        $(this).removeData('value');
        $(this).attr('src', 'graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg');
    });

    alert(`You submitted: "${currentWord}" for ${currentScore} points!`);
    updateRackUI();
}

// Set up board slots for dropping tiles
function setupBoardDroppables() {
    $('.boardSlot-droppable').droppable({
        accept: '.tile',
        drop: function (event, ui) {
            const tileElement = ui.draggable[0];
            const letter = tileElement.innerText;
            const value = parseInt(tileElement.getAttribute('data-value'));

            $(this).data('letter', letter);
            $(this).data('value', value);
            $(this).attr('src', `graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`);
            ui.draggable.remove();
        }
    });

    $('#rack').droppable({
        accept: '.tile',
        drop: function (event, ui) {
            updateRackUI();
        }
    });
}

function newGame() {
    setupGame();
}

$(document).ready(() => {
    setupGame();
});
