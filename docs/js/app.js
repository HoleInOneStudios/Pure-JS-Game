let canvas, ctx, width = 400, height = 300, scale = 1, interval = 60, resolution = 20;

document.body.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    resize();

    setInterval(() => {
        update();
    }, interval);
}

document.body.onresize = () => {
    resize();
}

/**
 * Resize the canvas to fit the window while maintaining the aspect ratio.
 */
function resize() {
    scale = Math.min(window.innerWidth / width, window.innerHeight / height);
    canvas.width = width * scale;
    canvas.height = height * scale;
}

/**
 * Update the canvas.
 */
function update() {
    //Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

}

function drawGrid() {
    //Draw the grid
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += resolution) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, height * scale);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += resolution) {
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(width * scale, i * scale);
        ctx.stroke();
    }
}