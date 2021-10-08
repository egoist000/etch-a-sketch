const DEFAULT_SIZE = 16; // 16x16 is default size
const grid = document.getElementById("grid");
let chosenColor = "black";

function cellHover(e) {
    e.target.style.backgroundColor = chosenColor;
}

function cellHoverEnd(e) {
    e.target.style.backgroundColor = chosenColor;
}

function createGrid(numberOfRows = DEFAULT_SIZE, numberOfColumns = DEFAULT_SIZE) {
    grid.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
    for(let i = 0; i < numberOfRows; i++) {
        for(let j = 0; j < numberOfColumns; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("mouseover", cellHover);
            cell.addEventListener("mouseout", cellHoverEnd);
            grid.appendChild(cell);
        }
    }
}

createGrid();