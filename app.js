const DEFAULT_SIZE = 16; // 16x16 is default size
const DEFAULT_OP = "draw";
const RAINBOW_COLORS = ["#ff0000", "#ffa500 ", "#ffff00 ", "#008000", "#0000ff", "#4b0082", "#ee82ee"];
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

function hslToRgb(hsl) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);
  
    let h = hsl[0],
        s = hsl[1].substr(0,hsl[1].length - 1) / 100,
        l = hsl[2].substr(0,hsl[2].length - 1) / 100;

    if (h.indexOf("deg") > -1) 
        h = h.substr(0,h.length - 3);
    else if (h.indexOf("rad") > -1)
        h = Math.round(h.substr(0,h.length - 3) * (180 / Math.PI));
    else if (h.indexOf("turn") > -1)
        h = Math.round(h.substr(0,h.length - 4) * 360);

    if (h >= 360)
        h %= 360;
    
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
}

function rgbToHsl(rgb) {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf("%") > -1) 
        rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
    }
  
    // Make r, g, and b fractions of 1
    let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;
    
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    
    if(delta == 0) h=0;
    else if(cmax == r) h = ((g - b) / delta) % 6;
    else if(cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if(h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    const hsl = [h, s, l];

    return hsl;
}

function doOperation(e) {
    switch(currentOperation) {
        case "erase":
            currentColor = "";
            break;
        case "rainbow":
            rainbow();
            break;
        case "shadow":
            shadow(e);
            break;
        case "light":
            light(e);
            break;
        default:
            break;
    }
}

function clearGrid() {
    for(let i = 0, n = cells.length; i < n; i++) {
        cells[i].style.backgroundColor = "rgb(255, 255, 255)";
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

function shadow(e) {
    let rgb = e.target.style.backgroundColor;
    if(rgb === "") {
        rgb = "rgb(255,255,255)";
    }
    let hsl = rgbToHsl(rgb);
    if(hsl[2] != 0) {
        if(hsl[2] - 5 < 0) hsl[2] = 0;
        else hsl[2] -= 5;

        hsl = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
        currentColor = hslToRgb(hsl);
    }
    else {
        currentColor = rgb;
    }
}

function light(e) {
    let rgb = e.target.style.backgroundColor;
    if(rgb === "") {
        rgb = "rgb(255,255,255)";
    }
    let hsl = rgbToHsl(rgb);
    if(hsl[2] != 100) {
        if(hsl[2] + 5 > 100) hsl[2] = 100;
        else hsl[2] += 5;

        hsl = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
        currentColor = hslToRgb(hsl);
    }
    else {
        currentColor = rgb;
    }
}

function cellClickAndHover(e) {
    if(e.buttons >= 1) {
        doOperation(e);
        e.target.style.backgroundColor = currentColor;
    }
}

function cellClick(e) {
    doOperation(e);
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