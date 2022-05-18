let canvas,
    ctx,
    width = 400,
    height = 300,
    scale = 1,
    interval = 60,
    resolution = 20,
    entities = [],
    player;

document.body.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    resize();

    player = new Player(0, 0, undefined, "black");

    HandleInput();

    setInterval(() => {
        update();
    }, interval);
};

document.body.onresize = () => {
    resize();
};

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
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    //draw the entities
    entities.forEach(entity => {
        entity.draw();
    });

    //draw the player
    player.draw();

    //TODO draw the ui
}

/**
 * Draws a grid on the canvas.
 */
function drawGrid() {
    //Draw the grid
    ctx.strokeStyle = "#000";
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

function HandleInput() {
    document.body.addEventListener("keydown", e => {
        e.preventDefault();
        if (e.keyCode === 37) {
            player.move(-1, 0);
        } else if (e.keyCode === 38) {
            player.move(0, -1);
        }
        if (e.keyCode === 39) {
            player.move(1, 0);
        }
        if (e.keyCode === 40) {
            player.move(0, 1);
        }
    });

}

class Entity {
    constructor (x, y, tex, col) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = col || "#000";
        this.texture = tex || undefined;
    }

    draw() {
        if (this.texture) {
            ctx.drawImage(this.texture, this.x * resolution * scale, this.y * resolution * scale, resolution * scale, resolution * scale);
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x * resolution * scale, this.y * resolution * scale, resolution * scale, resolution * scale);
        }
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }

    goto(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Player extends Entity {
    constructor (x, y, tex, col) {
        super(x, y, tex, col);
    }
}