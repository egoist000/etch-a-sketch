const DEFAULT_SIZE = 16; // 16x16 is default size
const DEFAULT_OP = "draw";
const RAINBOW_COLORS = ["violet", "indigo", "blue", "green", "yellow", "orange", "red"];
const grid = document.getElementById("grid");
const checkBox = document.getElementById("check");
const sizeSlider = document.getElementById("size");
const sizeOutput = document.getElementById("size-output");
const buttons = document.querySelectorAll("button");
const inputColor = document.getElementById("color-picker");
let currentColor = inputColor.value
let gridOutline = false;
let cells;
let currentOperation = DEFAULT_OP;
let rainbowIteration = 0;

function deleteGridCells() {
    grid.innerHTML = "";
}

function doOperation() {
    switch(currentOperation) {
        case "erase":
            currentColor = "white";
            break;
        case "rainbow":
            rainbow();
            break;
        default:
            break;
    }
}

function clearGrid() {
    for(let i = 0, n = cells.length; i < n; i++) {
        cells[i].style.backgroundColor = "white";
    }
}

function rainbow() {
    currentColor = RAINBOW_COLORS[rainbowIteration];
    if(rainbowIteration >= 6) {
        rainbowIteration = 0;
    }
    else {
        rainbowIteration++;
    }
}

function cellClickAndHover(e) {
    if(e.buttons >= 1) {
        doOperation();
        e.target.style.backgroundColor = currentColor;
    }
}

function cellClick(e) {
    doOperation();
    e.target.style.backgroundColor = currentColor;
}

function createGrid(numberOfRows = DEFAULT_SIZE, numberOfColumns = DEFAULT_SIZE) {
    grid.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
    for(let i = 0; i < numberOfRows * numberOfColumns; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.draggable = false;
        if(gridOutline) {
            cell.classList.add("cell-border");
        }
        cell.addEventListener("mousedown", cellClick);
        cell.addEventListener("mouseenter", cellClickAndHover);
        cell

        grid.appendChild(cell);
    }
    cells = Array.from(document.querySelectorAll("#grid div"));
}

function changeGridOutline() {
    for(let i = 0, n = cells.length; i < n; i++) {
        cells[i].classList.toggle("cell-border");
    }
    gridOutline = !gridOutline;
}

function changeGridSize(e) {
    deleteGridCells();
    let val = e.target.value;
    createGrid(val, val);
}

function changeSizeText(e) {
    let val = e.target.value;
    sizeOutput.textContent = `${val}x${val}`;
}

function updateImg(lastOperation, currentOperation) {
    document.querySelector(`.${lastOperation} img`).src = `icons/${lastOperation}-default.png`; //restore default image
    document.querySelector(`.${currentOperation} img`).src = `icons/${currentOperation}-click.png`;
}

function changeCurrentColor(e) {
    currentColor = e.target.value;
    if(currentOperation !== "draw") {
        updateImg(currentOperation, "draw");
        currentOperation = "draw";
    }
}

function buttonClicked(e) {
    let operation = e.target.classList[0];
    rainbowIteration = 0; // when switch operation reset rainbow iterator
    if(operation === "clear") {
        clearGrid();
    }
    else {
        if(operation === "draw") {
            currentColor = inputColor.value;
        }
        if(operation !== currentOperation) {
            updateImg(currentOperation, operation);
        }
        currentOperation = operation;
    }
}

function buttonsEventListener() {
    for(let i = 0, n = buttons.length; i < n; i++) {
        buttons[i].addEventListener("click", buttonClicked);
    }
}

createGrid();

window.addEventListener("load", buttonsEventListener);

sizeSlider.addEventListener("change", changeGridSize);
sizeSlider.addEventListener("input", changeSizeText);

inputColor.addEventListener("change", changeCurrentColor);

checkBox.addEventListener("change", changeGridOutline);