const DEFAULT_SIZE = 16; // 16x16 is default size
const grid = document.getElementById("grid");
const inputColor = document.getElementById("color-picker");
let currentColor = inputColor.value
const checkBox = document.getElementById("check");
const sizeSlider = document.getElementById("size");
const sizeOutput = document.getElementById("size-output");
let cells;
let gridOutline = false;

function clearGrid() {
    grid.innerHTML = "";
}

function cellHover(e) {
    e.target.style.backgroundColor = currentColor;
}

function cellHoverEnd(e) {
    e.target.style.backgroundColor = currentColor;
}

function cellClick(e) {
    e.target.style.backgroundColor = currentColor;
}

function createGrid(numberOfRows = DEFAULT_SIZE, numberOfColumns = DEFAULT_SIZE) {
    grid.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
    for(let i = 0; i < numberOfRows; i++) {
        for(let j = 0; j < numberOfColumns; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            //cell.addEventListener("mousedown", cellClick);
            cell.addEventListener("mouseover", cellHover);
            cell.addEventListener("mouseout", cellHoverEnd);
            grid.appendChild(cell);
        }
    }
    cells = Array.from(document.querySelectorAll("#grid div"));
}

function changeGridOutline() {
    if(gridOutline) {
        cells.forEach(cell => {
            cell.style.border = "none";
        });
        gridOutline = false;
    }
    else {
        cells.forEach(cell => {
            cell.style.border = "0.1rem solid #7F7F7F"
        });
        gridOutline = true;
    }
}

function changeGridSize(e) {
    clearGrid();
    let val = e.target.value
    sizeOutput.textContent = `${val}x${val}`;
    createGrid(val, val);
}

function changeCurrentColor(e) {
    currentColor = e.target.value;
}

createGrid();

sizeSlider.addEventListener("change", changeGridSize);

inputColor.addEventListener("change", changeCurrentColor);

checkBox.addEventListener("change", changeGridOutline);