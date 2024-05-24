import readline from "readline";
let shots = 0;
const GRID_SIZE = 10;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(" ")
);

const ships = [
    { name: "Battleship", size: 5, count: 1 },
    { name: "Destroyer", size: 4, count: 2 },
];

function placeShips() {
    ships.forEach((ship) => {
        for (let i = 0; i < ship.count; i++) {
            placeShip(ship.size);
        }
    });
}

function placeShip(size) {
    let placed = false;
    while (!placed) {
        const isHorizontal = Math.random() >= 0.5;
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceShip(row, col, size, isHorizontal)) {
            for (let i = 0; i < size; i++) {
                if (isHorizontal) {
                    grid[row][col + i] = "S";
                } else {
                    grid[row + i][col] = "S";
                }
            }
            placed = true;
        }
    }
}

function canPlaceShip(row, col, size, isHorizontal) {
    if (isHorizontal) {
        if (col + size > GRID_SIZE) return false;
        for (let i = 0; i < size; i++) {
            if (grid[row][col + i] === "S") return false;
        }
    } else {
        if (row + size > GRID_SIZE) return false;
        for (let i = 0; i < size; i++) {
            if (grid[row + i][col] === "S") return false;
        }
    }
    return true;
}

function displayGrid() {
    console.log("   A B C D E F G H I J");
    for (let row = 0; row < GRID_SIZE; row++) {
        let rowDisplay = (row + 1).toString().padStart(2, " ") + " ";
        for (let col = 0; col < GRID_SIZE; col++) {
            rowDisplay +=
                grid[row][col] === "H" || grid[row][col] === "M"
                    ? grid[row][col]
                    : "●";
            rowDisplay += " ";
        }
        console.log(rowDisplay);
    }
}

function allShipsSunk() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === "S") return false;
        }
    }
    return true;
}

function parseCoordinates(input) {
    const letter = input.charAt(0).toUpperCase();
    const number = +input.slice(1);
    if (!/^[A-J]$/.test(letter) || isNaN(number) || number < 1 || number > 10) {
        throw new Error("Invalid coordinates");
    }
    return { row: number - 1, col: letter.charCodeAt(0) - "A".charCodeAt(0) };
}

function playTurn() {
    rl.question("Enter coordinates: ", (input) => {
        try {
            const { row, col } = parseCoordinates(input);
            if (grid[row][col] === "S") {
                grid[row][col] = "H";
                console.log("Hit!");
                shots++;
            } else if (grid[row][col] === " " || grid[row][col] === "●") {
                grid[row][col] = "M";
                console.log("Miss.");
                shots++;
            } else {
                console.log("Already targeted. Try again.");
            }

            displayGrid();

            if (allShipsSunk()) {
                console.log(
                    `Congratulations! You sagstnk all the ships in ${shots} shots`
                );
                rl.close();
            } else {
                playTurn();
            }
        } catch (e) {
            console.error(e.message);
            playTurn();
        }
    });
}

function main() {
    placeShips();
    displayGrid();
    playTurn();
}

main();

export {
    GRID_SIZE,
    grid,
    placeShips,
    placeShip,
    canPlaceShip,
    allShipsSunk,
    parseCoordinates,
    playTurn,
    rl,
};
