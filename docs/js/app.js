let canvas,
    ctx,
    width = 400,
    height = 300,
    scale = 1,
    interval = 60,
    resolution = 20,
    entities = [],
    player;

let image = {
    ball1: new Image(),
    ball2: new Image(),
    ball3: new Image(),
    ball4: new Image(),
    ball5: new Image(),
    ball6: new Image(),
}

image.ball1.src = "img/ball1.png";
image.ball2.src = "img/ball2.png";
image.ball3.src = "img/ball3.png";
image.ball4.src = "img/ball4.png";
image.ball5.src = "img/ball5.png";
image.ball6.src = "img/ball6.png";

document.body.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    resize();

    entities.push(new Entity(5, 5, image.ball2));

    player = new Player(0, 0, image.ball1, "black");

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
        let x = 0, y = 0;
        if (e.keyCode === 37) {  //left
            if (player.x > 0) {
                x = -1;
            }
        } else if (e.keyCode === 38) {  //down
            if (player.y > 0) {
                y = -1;
            }
        } else if (e.keyCode === 39) {  //right
            if (player.x < resolution - 1) {
                x = 1;
            }
        } else if (e.keyCode === 40) { //up
            if (player.y < resolution * (height/width) - 1) {
                y = 1;
            }
        }
        

        player.move(x, y);
        //console.log(player.x + ", " + player.y);
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
        entities.forEach(en => {
            if (en.x === this.x + x && en.y === this.y + y && !(en === this)) {
                x = 0;
                y = 0;
            }
        });
        if (!(this === player) && this.x + x === player.x && this.y + y === player.y) {
            x = 0;
            y = 0;
        }

        this.x += x;
        this.y += y;
    }

    goto(x, y) {
        entities.forEach(en => {
            if (!(en.x === x) && !(en.y === y) && !(en === this)) {
                this.x = x;
                this.y = y;
            }
        });
        
    }
}

class Player extends Entity {
    constructor (x, y, tex, col) {
        super(x, y, tex, col);
    }
}