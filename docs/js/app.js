let canvas,
    ctx,
    width = 400,
    height = 300,
    scale = 1,
    interval = 60,
    resolution = 20,
    entities = [],
    player;

// Image Object
let image = {
    ball1: undefined,
    ball2: undefined,
    ball3: undefined,
    ball4: undefined,
    ball5: undefined,
    ball6: undefined,
}

// Audio Object
let audio = {
    click1: undefined,
    click2: undefined,
    click3: undefined,
    click4: undefined,
    click5: undefined,
}

// Initialize the canvas and start the game loop
document.body.onload = () => {
    canvas = document.getElementById("canvas"); //get the canvas
    ctx = canvas.getContext("2d"); //get the context
    ctx.imageSmoothingEnabled = false; //disable image smoothing

    //Load Images and Audio
    LoadImages();
    LoadAudio();

    resize(); //resize the canvas

    entities.push(new Entity(0, 0, image.ball1, 0x000)); //add the player
    entities.push(new Entity(5, 5, image.ball2, 0xf00)); //add a ball

    player = entities[0]; //set the player

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

    drawDebugGrid();

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
function drawDebugGrid() {
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

    //Draw coordinates
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    for (let i = 0; i < width; i += resolution) { //horizontal lines
        for (let j = 0; j <= height; j += resolution) { //vertical lines
            ctx.fillText(`(${i/resolution}, ${j/resolution})`, i * scale, j * scale);
        }

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
            x = -1;
        } else if (e.keyCode === 38) {  //down arrow
            e.preventDefault();
            y = -1;
        } else if (e.keyCode === 39) {  //right arrow
            e.preventDefault();
            x = 1;
        } else if (e.keyCode === 40) { //up arrow
            e.preventDefault();
            y = 1;
        }
        

        player.move(x, y);
        //console.log(player.x + ", " + player.y);
    });

    document.body.addEventListener("mousedown", e => {
        if (e.button === 0) { //left click
            let x = e.clientX - canvas.offsetLeft,
                y = e.clientY - canvas.offsetTop;

            //console.log(x, y);

            x = Math.floor(x / scale / resolution);
            y = Math.floor(y / scale / resolution);

            //console.log(x, y);

            player.goto(x, y);
        }
    });
}

/**
 * Loads all the images
 */
async function LoadImages() {
    for (const key in image) {
        ImageLoader(key);
    }
}

/**
 * Loads all the audio
 */
async function LoadAudio() {
    for (const key in audio) {
        AudioLoader(key);
    }
}

/**
 * Loads an image
 * @param {key} key The key of the image
 * @returns {Promise} A promise that resolves when the image is loaded
 */
function ImageLoader(key) {
    return new Promise((resolve, reject) => {
        image[key] = new Image();
        image[key].src = `img/${key}.png`;
        image[key].onload = () => resolve();
        image[key].onerror = () => reject(new Error(`Could not load image: ${key}`));
    });
}

/**
 * Loads an audio
 * @param {key} key 
 * @returns {Promise} A promise that resolves when the audio is loaded
 */
function AudioLoader(key) {
    return new Promise((resolve, reject) => {
        audio[key] = new Audio(`audio/${key}.ogg`);
        audio[key].oncanplay = () => resolve();
        audio[key].onerror = () => reject(new Error(`Could not load audio: ${key}`));
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
     * @param {number} _x x-coordinate
     * @param {number} _y y-coordinate
     */
    move(_x, _y) {
        entities.forEach(en => {
            if (this.checkCollisionForMove(_x, _y, en)) {
                _x = 0;
                _y = 0;
                audio.click5.play();
            }
        });

        if ((this.x + _x >= 0) && (this.x + _x <= resolution - 1)) {
            //move x
            this.x += _x;
            
        }
        if ((this.y + _y >= 0) && (this.y + _y <= resolution * (height / width) - 1)) {
            //move y
            this.y += _y;
            
        }

        if (_y !== 0 || _x !== 0) {
            audio.click5.play();
        }
        
    }

    /**
     * Moves the entity to the given coordinates.
     * @param {number} _x x-coordinate
     * @param {number} _y y-coordinate
     */
    goto(_x, _y) {
        //check if space is available
        entities.forEach(en => {
            if ((en !== this) && en.checkCollision(_x, _y)) {
                _x = this.x;
                _y = this.y;
            }
        });
        

        // move the entity
        audio.click2.play();
        this.x = _x;
        this.y = _y;

    }

    /**
     * 
     * @param {number} _x x-coordinate modifier
     * @param {number} _y y-coordinate modifier
     * @param {Entity} en entity to check collision with
     * @returns {boolean} if space is occupied
     */
    checkCollisionForMove(_x, _y, en) {
        return (en !== this) && en.x === this.x + _x && en.y === this.y + _y;
    }

    /**
     * 
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @returns {boolean} if the entity is at the given coordinates
     */
    checkCollision(_x, _y) {
        return this.x === _x && this.y === _y;
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