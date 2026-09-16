// Tetris Game Logic

// Game Grid and Piece Representation
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const EMPTY = "black";

// Tetromino shapes and their colors
const SHAPES = [
    { shape: [[1, 1, 1, 1]], color: "cyan" },    // I
    { shape: [[1, 1], [1, 1]], color: "yellow" },    // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: "purple" }, // T
    { shape: [[1, 1, 0], [0, 1, 1]], color: "red" },    // Z
    { shape: [[0, 1, 1], [1, 1, 0]], color: "green" },  // S
    { shape: [[1, 0, 0], [1, 1, 1]], color: "blue" },   // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: "orange" }   // L
];

// Game state
let grid = createGrid();
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let gameOver = false;
let dropInterval = 1000;
let dropStart = 0;

// Canvas and UI elements
let canvas, ctx, nextCanvas, nextCtx, scoreDisplay, levelDisplay;

// Initialize the game with provided elements
function initGame(gameCanvas, nextPieceCanvas, scoreElement, levelElement) {
    canvas = gameCanvas;
    nextCanvas = nextPieceCanvas;
    scoreDisplay = scoreElement;
    levelDisplay = levelElement;
    
    ctx = canvas.getContext("2d");
    nextCtx = nextCanvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    nextCanvas.width = 4 * BLOCK_SIZE;
    nextCanvas.height = 4 * BLOCK_SIZE;

    spawnPiece();
    spawnNextPiece();
    updateScore();
    dropStart = Date.now();
    gameLoop();
    document.addEventListener("keydown", handleKeyPress);
}

// Create an empty grid
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

// Spawn a new random piece
function spawnPiece() {
    if (nextPiece) {
        currentPiece = nextPiece;
    } else {
        const randomIndex = Math.floor(Math.random() * SHAPES.length);
        currentPiece = {
            shape: SHAPES[randomIndex].shape,
            color: SHAPES[randomIndex].color,
            pos: { x: Math.floor(COLS / 2) - 1, y: 0 }
        };
    }
    spawnNextPiece();
    
    // Check if game over
    if (collision()) {
        gameOver = true;
        alert("Game Over!");
    }
}

// Spawn the next piece for preview
function spawnNextPiece() {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    nextPiece = {
        shape: SHAPES[randomIndex].shape,
        color: SHAPES[randomIndex].color,
        pos: { x: 1, y: 1 } // Center the preview
    };
    drawNextPiece();
}

// Draw the next piece on the preview canvas
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (!nextPiece) return;
    
    const shape = nextPiece.shape;
    const blockSize = BLOCK_SIZE;
    // Calculate the offset to center the piece
    const offsetX = (nextCanvas.width / blockSize - shape[0].length) / 2;
    const offsetY = (nextCanvas.height / blockSize - shape.length) / 2;
    
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(
                    (x + offsetX) * blockSize,
                    (y + offsetY) * blockSize,
                    blockSize, blockSize
                );
                nextCtx.strokeStyle = "black";
                nextCtx.strokeRect(
                    (x + offsetX) * blockSize,
                    (y + offsetY) * blockSize,
                    blockSize, blockSize
                );
            }
        });
    });
}

// Draw the game grid and current piece
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the grid
    grid.forEach((row, y) => {
        row.forEach((color, x) => {
            if (color !== EMPTY) {
                ctx.fillStyle = color;
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = "black";
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
    
    // Draw the current piece
    if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect(
                        (currentPiece.pos.x + x) * BLOCK_SIZE,
                        (currentPiece.pos.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE, BLOCK_SIZE
                    );
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(
                        (currentPiece.pos.x + x) * BLOCK_SIZE,
                        (currentPiece.pos.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE, BLOCK_SIZE
                    );
                }
            });
        });
    }
}

// Game loop
function gameLoop() {
    if (gameOver) return;
    
    const now = Date.now();
    const delta = now - dropStart;
    
    if (delta > dropInterval) {
        moveDown();
        dropStart = now;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Move piece down
function moveDown() {
    if (!currentPiece) return;
    
    currentPiece.pos.y++;
    
    if (collision()) {
        currentPiece.pos.y--;
        lockPiece();
        clearLines();
        spawnPiece();
    }
    
    dropStart = Date.now();
}

// Move piece left
function moveLeft() {
    if (!currentPiece) return;
    
    currentPiece.pos.x--;
    
    if (collision()) {
        currentPiece.pos.x++;
    }
}

// Move piece right
function moveRight() {
    if (!currentPiece) return;
    
    currentPiece.pos.x++;
    
    if (collision()) {
        currentPiece.pos.x--;
    }
}

// Rotate piece
function rotate() {
    if (!currentPiece) return;
    
    const originalShape = currentPiece.shape;
    const rows = originalShape.length;
    const cols = originalShape[0].length;
    
    // Create a new rotated shape
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            rotated[x][rows - 1 - y] = originalShape[y][x];
        }
    }
    
    const originalShapeBackup = currentPiece.shape;
    currentPiece.shape = rotated;
    
    if (collision()) {
        currentPiece.shape = originalShapeBackup;
    }
}

// Check for collisions
function collision() {
    if (!currentPiece) return false;
    
    const shape = currentPiece.shape;
    const pos = currentPiece.pos;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const newX = pos.x + x;
                const newY = pos.y + y;
                
                if (
                    newX < 0 || 
                    newX >= COLS ||
                    newY >= ROWS ||
                    (newY >= 0 && grid[newY][newX] !== EMPTY)
                ) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Lock the piece in place
function lockPiece() {
    if (!currentPiece) return;
    
    const shape = currentPiece.shape;
    const pos = currentPiece.pos;
    
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const gridY = pos.y + y;
                const gridX = pos.x + x;
                if (gridY >= 0) {
                    grid[gridY][gridX] = currentPiece.color;
                }
            }
        });
    });
}

// Clear completed lines and update score
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell !== EMPTY)) {
            // Remove the line
            grid.splice(y, 1);
            // Add a new empty line at the top
            grid.unshift(Array(COLS).fill(EMPTY));
            linesCleared++;
            y++; // Re-check the same row (now with new content)
        }
    }
    
    if (linesCleared > 0) {
        updateScore(linesCleared);
    }
}

// Update score based on lines cleared
function updateScore(linesCleared = 0) {
    const points = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 lines
    score += points[linesCleared] * level;
    
    // Update level every 10 lines
    level = Math.floor(score / 1000) + 1;
    
    // Increase game speed (cap at 100ms)
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }
    if (levelDisplay) {
        levelDisplay.textContent = level;
    }
}

// Handle keyboard input
function handleKeyPress(event) {
    if (gameOver) return;
    
    switch (event.keyCode) {
        case 37: // Left arrow
            moveLeft();
            break;
        case 39: // Right arrow
            moveRight();
            break;
        case 40: // Down arrow
            moveDown();
            break;
        case 38: // Up arrow
            rotate();
            break;
    }
}