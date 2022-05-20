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

let audio = {
    click1: new Audio(),
    click2: new Audio(),
    click3: new Audio(),
    click4: new Audio(),
    click5: new Audio(),
}

image.ball1.src = "img/ball1.png";
image.ball2.src = "img/ball2.png";
image.ball3.src = "img/ball3.png";
image.ball4.src = "img/ball4.png";
image.ball5.src = "img/ball5.png";
image.ball6.src = "img/ball6.png";

audio.click1.src = "audio/click1.ogg";
audio.click2.src = "audio/click2.ogg";
audio.click3.src = "audio/click3.ogg";
audio.click4.src = "audio/click4.ogg";
audio.click5.src = "audio/click5.ogg";

// Initialize the canvas and start the game loop
document.body.onload = () => {
    canvas = document.getElementById("canvas"); //get the canvas
    ctx = canvas.getContext("2d"); //get the context

    resize(); //resize the canvas

    //entities.push(new Entity(5, 5, image.ball2)); 

    player = new Player(0, 0, image.ball1, "black"); //create the player

    HandleInput(); //add event listeners to handle the input

    setInterval(() => { //start the game loop
        update();
    }, interval);
};

// when the window is resized, resize the canvas
document.body.onresize = () => {
    resize();
};

/**
 * Resize the canvas to fit the window while maintaining the aspect ratio.
 */
function resize() {
    scale = Math.min(window.innerWidth / width, window.innerHeight / height); //calculate the scale
    canvas.width = width * scale; //set the width
    canvas.height = height * scale; //set the height
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
    for (let i = 0; i < width; i += resolution) { //horizontal lines
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, height * scale);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += resolution) { //vertical lines
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(width * scale, i * scale);
        ctx.stroke();
    }
}

/**
 * Handles the input from the user.
 */
function HandleInput() {
    document.body.addEventListener("keydown", e => {
        
        let x = 0, y = 0;
        if (e.keyCode === 37) {  //left arrow
            e.preventDefault();
            if (player.x > 0) {
                x = -1;
            }
        } else if (e.keyCode === 38) {  //down arrow
            if (player.y > 0) {
                e.preventDefault();
                y = -1;
            }
        } else if (e.keyCode === 39) {  //right arrow
            e.preventDefault();
            if (player.x < resolution - 1) {
                x = 1;
            }
        } else if (e.keyCode === 40) { //up arrow
            e.preventDefault();
            if (player.y < resolution * (height/width) - 1) {
                y = 1;
            }
        }
        

        player.move(x, y);
        //console.log(player.x + ", " + player.y);
    });

    document.body.addEventListener("mousedown", e => {
        audio.click4.play();
        
        let x = e.clientX - canvas.offsetLeft,
            y = e.clientY - canvas.offsetTop;

        //console.log(x, y);

        x = Math.floor(x /scale / resolution);
        y = Math.floor(y /scale / resolution);

        //console.log(x, y);

        player.goto(x, y);
    });
}

/**
 * Entity class.
 */
class Entity {
    /**
     * Constructor for the entity.
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @param {Image} tex texture
     * @param {number} col color
     */
    constructor (x, y, tex, col) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = col || 0x000;
        this.texture = tex || undefined;
    }

    /**
     * Draws the entity on the canvas.
     */
    draw() {
        if (this.texture) { //if there is a texture
            // draw the texture
            ctx.drawImage(this.texture, this.x * resolution * scale, this.y * resolution * scale, resolution * scale, resolution * scale);
        }
        else { //if there is no texture
            // draw the color
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x * resolution * scale, this.y * resolution * scale, resolution * scale, resolution * scale);
        }
    }

    /**
     * Moves the entity by the given amount.
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     */
    move(x, y) {
        entities.forEach(en => {
            if (this.checkCollision(en) && !(en === this)) { //if there is an entity in the way
                // stop moving
                x = 0;
                y = 0;
            }
        });
        if (this.checkCollision(player) && !(this === player)) { //if the player is in the way
            // stop moving
            x = 0;
            y = 0;
        }

        // move the entity
        this.x += x;
        this.y += y;
    }

    /**
     * Moves the entity to the given coordinates.
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     */
    goto(x, y) {
        entities.forEach(en => {
            if (this.checkCollision(en) && !(en === this)) { //if there is an entity in the way
                // stop moving
                x = this.x;
                y = this.y;
            }
        });

        if (this.checkCollision(player) && !(this === player)) { //if the player is in the way
            // cancel the goto
            this.x = 0;
            this.y = 0;
        }

        // move the entity
        this.x = x;
        this.y = y;
        
    }

    /**
     * Checks if the entity is in the given coordinates.
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean} true if the entity is at the given coordinates
     */
    checkCollision(x, y) {
        if (this.x === x && this.y === y) {
            return true;
        }
        return false;
    }

    /**
     * Checks if the entity is at the same coordinates as the entity given.
     * @param {Entity} en 
     * @returns {boolean} true if the entity is at the same coordinates as the given entity
     */
    checkCollision(en) {
        if (this.x === en.x && this.y === en.y) {
            return true;
        }
        return false;
    }
}

/**
 * Player class.
 */
class Player extends Entity {
    /**
     * Constructor for the player.
     * @param {number} x 
     * @param {number} y 
     * @param {Image} tex 
     * @param {number} col 
     */
    constructor (x, y, tex, col) {
        super(x, y, tex, col);
    }
}