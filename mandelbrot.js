const canvas = document.getElementById("canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width  = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
const label = document.getElementById("label");

const scaleFactor = 1 / 150;
const originR = 0;
const originI = 0;

const colors = [
    "rgb(254, 0, 0)",
    "rgb(255, 121, 1)",
    "rgb(255, 255, 11)",
    "rgb(34, 219, 19)",
    "rgb(36, 48, 255)",
    "rgb(102, 0, 146)",
    "rgb(200, 0, 249)"
];

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        plotInSet(x, y);
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    width = window.innerWidth;
    height = window.innerHeight;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            plotInSet(x, y);
        }
    }
  })

canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    // ctx.clearRect(0, 0, width, height);
    plotInSet(x, y);

});

function plotInSet(x, y) {
    const [cr, ci] = screenToWorld(x, y);
    
    let zr = 0;
    let zi = 0;
    for (let k = 0; k < 100; k++) {
        const _zr = zr * zr - zi * zi + cr;
        const _zi = 2 * zr * zi + ci;
        zr = _zr;
        zi = _zi;
        const dist = Math.sqrt(zr * zr  + zi * zi);
        if (dist > 2) {
            const color = colors[k % colors.length];
            ctx.fillStyle = color;
            plotPoint(x, y);
            return;
        }
        // const [x1, y1] = worldToScreen(zr, zi);
        // const color = colors[k % colors.length];
        // ctx.fillStyle = color;
        // plotPoint(x1, y1);
    }
    const dist = Math.sqrt(zr * zr  + zi * zi);
    if (dist < 2) {
        ctx.fillStyle = "black";
        plotPoint(x, y);
    }
}

function plotPoint(x, y, radius=1) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function plotLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function screenToWorld(x, y) {
    const r = originR +(x - width / 2) * scaleFactor;
    const i = - originI + (y - height / 2 ) * scaleFactor;
    return [r, i];
}

function worldToScreen(r, i) {
    const x = (r - originR) / scaleFactor + width / 2;
    const y = -(i - originI) / scaleFactor + height / 2;
    return [x, y];
}