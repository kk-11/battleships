import {
    GRID_SIZE,
    grid,
    rl,
    allShipsSunk,
    canPlaceShip,
    parseCoordinates,
    placeShips,
    playTurn,
} from "./main.js";

describe("Test Suite: Battleships", () => {
    let mockQuestion;
    beforeEach(() => {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                grid[row][col] = " ";
            }
        }
        mockQuestion = jest.fn().mockImplementationOnce((_, cb) => cb("A1"));
        jest.spyOn(global.console, "log").mockImplementation(() => {});
    });

    describe("=== Ship Placement ===", () => {
        it("should place ships without overlapping", () => {
            placeShips();
            let shipSectionCount = 0;
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (grid[row][col] === "S") shipSectionCount++;
                }
            }
            const staticShips = 1 * 5 + 2 * 4;
            expect(shipSectionCount).toBe(staticShips);
        });
        it("should not allow placing a ship on another ship", () => {
            grid[0][0] = "S";
            const horizontal = canPlaceShip(0, 0, 1, true);
            const vertical = canPlaceShip(0, 0, 1, false);
            expect(horizontal).toBe(false);
            expect(vertical).toBe(false);
        });

        it("should not allow placing ships out of bounds", () => {
            const result = canPlaceShip(0, -1, 1, true);
            expect(result).toBe(false);
        });

        it("should allow placing ships within bounds", () => {
            const result = canPlaceShip(0, 0, 5, true);
            expect(result).toBe(true);
        });
    });

    describe("=== Hit Detection ===", () => {
        it("should detect game over when all ships are sunk", () => {
            placeShips();
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (grid[row][col] === "S") grid[row][col] = "H";
                }
            }
            expect(allShipsSunk()).toBe(true);
        });

        it("should continue game if there are still ships on the board", () => {
            placeShips();
            rl.question = mockQuestion;
            playTurn();
            expect(allShipsSunk()).toBe(false);
        });
    });

    describe("=== Coordinate Parsing ===", () => {
        it("should parse valid coordinates", () => {
            const firstSquare = parseCoordinates("A1");
            expect(firstSquare).toEqual({ row: 0, col: 0 });
            const lastSquare = parseCoordinates("J10");
            expect(lastSquare).toEqual({ row: 9, col: 9 });
        });
        it("should throw an error for invalid coordinates", () => {
            expect(() => parseCoordinates("Z100")).toThrow(
                "Invalid coordinates"
            );
        });
    });

    describe("=== Play Turn ===", () => {
        it("handles invalid input gracefully", () => {
            const mockQuestion = jest
                .fn()
                .mockImplementationOnce((_, cb) => cb("InvalidInput"));
            rl.question = mockQuestion;
            jest.spyOn(global.console, "error").mockImplementationOnce(
                () => "Invalid coordinates"
            );
            playTurn();
            expect(console.error).toHaveBeenCalledWith("Invalid coordinates");
        });

        it("logs message when targeting an already marked position", () => {
            grid[0][0] = "M";
            rl.question = mockQuestion;
            playTurn();
            expect(console.log).toHaveBeenCalledWith(
                "Already targeted. Try again."
            );
        });

        it("logs message when a hit is registered", () => {
            grid[0][0] = "S";
            rl.question = mockQuestion;
            playTurn();
            expect(console.log).toHaveBeenCalledWith("Hit!");
        });

        it("logs message when a miss is registered", () => {
            grid[0][0] = " ";
            rl.question = mockQuestion;
            playTurn();
            expect(console.log).toHaveBeenCalledWith("Miss.");
        });
    });
});
