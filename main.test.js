import {
    GRID_SIZE,
    allShipsSunk,
    canPlaceShip,
    grid,
    parseCoordinates,
    placeShips,
    playTurn,
    rl,
} from "./main.js";

describe("Battleships Game", () => {
    beforeEach(() => {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                grid[row][col] = " ";
            }
        }
    });

    describe("Ship Placement", () => {
        it("should place ships without overlapping", () => {
            placeShips();
            let shipCount = 0;
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (grid[row][col] === "S") shipCount++;
                }
            }
            expect(shipCount).toBe(1 * 5 + 2 * 4);
        });

        it("should not allow placing ships out of bounds", () => {
            const result = canPlaceShip(0, GRID_SIZE - 1, 5, true);
            expect(result).toBe(false);
        });

        it("should allow placing ships within bounds", () => {
            const result = canPlaceShip(0, 0, 5, true);
            expect(result).toBe(true);
        });
    });

    describe("Hit Detection", () => {
        it("should detect game over when all ships are sunk", () => {
            placeShips();
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (grid[row][col] === "S") grid[row][col] = "H";
                }
            }
            expect(allShipsSunk()).toBe(true);
        });
        it("should not detect game over if ships remain", () => {
            placeShips();
            expect(allShipsSunk()).toBe(false);
        });
    });

    describe("Coordinate Parsing", () => {
        it("should parse valid coordinates", () => {
            const result = parseCoordinates("A1");
            expect(result).toEqual({ row: 0, col: 0 });
        });
        it("should throw an error for invalid coordinates", () => {
            expect(() => parseCoordinates("Z9")).toThrow("Invalid coordinates");
        });
    });

    describe("Play Turn", () => {
        it("handles invalid input gracefully", () => {
            const mockQuestion = jest
                .fn()
                .mockImplementationOnce((_, cb) => cb("InvalidInput"));
            rl.question = mockQuestion;

            jest.spyOn(global.console, "log").mockImplementation(() => {});
            jest.spyOn(global.console, "error").mockImplementation(() => {});
            jest.spyOn(global.console, "error").mockImplementationOnce(
                () => "Invalid coordinates"
            );
            playTurn();
            expect(console.error).toHaveBeenCalledWith("Invalid coordinates");
        });

        it("logs message when targeting an already marked position", () => {
            grid[0][0] = "M";

            jest.spyOn(global.console, "log").mockImplementation(() => {});
            const mockQuestion = jest
                .fn()
                .mockImplementationOnce((_, cb) => cb("A1"));
            rl.question = mockQuestion;
            playTurn();
            expect(console.log).toHaveBeenCalledWith(
                "Already targeted. Try again."
            );
        });

        it("logs message when a hit is registered", () => {
            grid[0][0] = "S";

            jest.spyOn(global.console, "log").mockImplementation(() => {});
            const mockQuestion = jest
                .fn()
                .mockImplementationOnce((_, cb) => cb("A1"));
            rl.question = mockQuestion;
            playTurn();
            expect(console.log).toHaveBeenCalledWith("Hit!");
        });
    });
});
