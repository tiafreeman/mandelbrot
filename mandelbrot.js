const canvas = document.getElementById("canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width  = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
const label = document.getElementById("label");

const scaleFactor = 1 / 400;
const originR = 0;
const originI = 0;

const colors = [
    [254, 0, 0],
    [255, 121, 1],
    [255, 255, 11],
    [34, 219, 19],
    [36, 48, 255],
    [102, 0, 146],
    [200, 0, 249]
];

initializeCanvasSize();
renderMandelbrot();

window.addEventListener("resize", debounce(() => {
    initializeCanvasSize();
    renderMandelbrot();
}, 100));

function initializeCanvasSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function renderMandelbrot() {
    const imgData = ctx.createImageData(width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const color = getMandelbrotColor(x, y);
            const index = (y * width + x) * 4;
            imgData.data[index] = color[0];
            imgData.data[index + 1] = color[1];
            imgData.data[index + 2] = color[2];
            imgData.data[index + 3] = 255; // Alpha channel
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function getMandelbrotColor(x, y) {
    const [cr, ci] = screenToWorld(x, y);
    let zr = 0;
    let zi = 0;

    for (let k = 0; k < 100; k++) {
        const _zr = zr * zr - zi * zi + cr;
        const _zi = 2 * zr * zi + ci;
        zr = _zr;
        zi = _zi;

        if (zr * zr + zi * zi > 4) {
            return colors[k % colors.length]; // This now returns an RGB array directly
        }
    }

    return [0, 0, 0]; // Black if the point is in the Mandelbrot set
}

function screenToWorld(x, y) {
    const r = originR +(x - width / 2) * scaleFactor;
    const i = - originI + (y - height / 2 ) * scaleFactor;
    return [r, i];
}


function debounce(fn, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}