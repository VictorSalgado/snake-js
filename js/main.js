class Game {

    constructor() {
        document.addEventListener("keydown", this.keyEvents.bind(this));
        document.addEventListener("keydown", () => {
            init = 1;
        })
    }

    // Window size
    gameWindow() {
        this.winWidth = 400;
        this.winHeight = 400;
        createCanvas(this.winWidth, this.winHeight).parent("gameBox");
    }

    // Draw in the window
    draw() {

        background("rgb(73, 95, 105)"); // Screen game
        stroke("rgba(255, 255, 255,.5)") // Screen border color

        this.snake(); // Draw snake
        this.apple(); // Draw apple
        this.scoreBoard();
        this.bestScore();
    }

    update() {
        this.frame = false;
        this.draw(); // Draw screen
    }

    start() {

        if (init > 0) {
            if (this.score > 0) {
                document.getElementById("score").textContent = this.score;
            }
            document.getElementById("gameHeader").style.display = "none";
            document.getElementById("gameBox").style.display = "none";
            document.getElementById("saveScore").style.display = "flex"; 
        }

        this.positionX = 15; // Snake init position X
        this.positionY = 10; // Snake init position Y
        this.appleX = this.appleY = 10; // Apple init position
        this.trail = []; // Array of snake coord
        this.tailSize = 5; // Snake init size
        this.speedX = this.speedY = 0; // Snake init speed
        this.gridSize = this.tileCount = 20; // Grid size
        this.fps = 1000 / 18; // Images per second
        this.timer = setInterval(this.update.bind(this), this.fps);
        this.score = 0;
        this.init = 0;
    }

    reset() {

        clearInterval(this.timer); // Reset time
        this.start(); // Restart game 
    }

    keyEvents(e) {
        console.log(init);

        // To the left
        if (e.key === "ArrowLeft" && this.speedX !== 1) {
            this.speedX = -1;
            this.speedY = 0;
            this.frame = true;
        }
        // To the right
        if (e.key === "ArrowRight" && this.speedX !== -1) {
            this.speedX = 1;
            this.speedY = 0;
            this.frame = true;
        }
        // To the bottom
        if (e.key === "ArrowDown" && this.speedY !== -1) {
            this.speedX = 0;
            this.speedY = 1;
            this.frame = true;
        }
        // To the top
        if (e.key === "ArrowUp" && this.speedY !== 1) {
            this.speedX = 0;
            this.speedY = -1;
            this.frame = true;
        }
    }

    // Game items 

    // Snake
    snake() {

        // Snake color
        fill("rgba(255,255,255,.75)");
        
        // Snake movement
        this.trail.forEach(a => {
            rect(a.positionX * 20, a.positionY * 20, this.gridSize - 5, this.gridSize - 5, 20, 20);
        })
        this.positionX += this.speedX;
        this.positionY += this.speedY;

        if (this.positionX < 0) {
            this.positionX = this.tileCount - 1;
        } else if (this.positionY < 0) {
            this.positionY = this.tileCount - 1;
        } else if (this.positionX > this.tileCount - 1) {
            this.positionX = 0;
        } else if (this.positionY > this.tileCount - 1) {
            this.positionY = 0;
        }

        // If dead
        this.trail.forEach(t => {
            if (this.positionX === t.positionX && this.positionY === t.positionY) {
                this.reset();
            }
        })

        // Snake position
        this.trail.push({ positionX: this.positionX, positionY: this.positionY })


        // Limits the size of the snake
        while (this.trail.length > this.tailSize) {
            this.trail.shift();
        }

        while (this.trail.length > this.tailSize) {
            this.trail.shift();
        }
    }

    // Apple 
    apple() {

        // Apple color
        fill("red");

        rect(this.appleX * this.tileCount, this.appleY * this.tileCount, this.gridSize - 5, this.gridSize - 5, 5, 5);

        // If eat
        if (this.appleX === this.positionX && this.appleY === this.positionY) {

            this.tailSize++;
            this.score++;
            this.appleX = Math.floor(Math.random() * this.tileCount);
            this.appleY = Math.floor(Math.random() * this.tileCount);
            this.trail.forEach(t => {
                if (this.appleX === t.positionX && this.appleY == t.positionY) {
                    this.apple();
                }
            });
        }
    }

    // Current score board
    scoreBoard() {

        if (this.score > 0) {
            localStorage.setItem("currentScore", this.score);
        }
        document.getElementById("currentScore").textContent = this.score;
    }

    // Best own score
    bestScore() {

        if (!localStorage.getItem("best")) {
            localStorage.setItem("best", 0);
        }

        if (this.score > localStorage.getItem("best")) {
            this.best = this.score;
            localStorage.setItem("best", this.best);
        }

        document.getElementById("bestScore").textContent = localStorage.getItem("best");
    }
}

const game = new Game();
var init = 0;

window.onload = () => {

    document.getElementById("closeButton").onclick = function() {
        document.getElementById("saveScore").style.display = "none"; 
        document.getElementById("gameBox").style.display = "unset";
        document.getElementById("gameHeader").style.display = "flex";
        init = 0;
        game.reset();
    };
    
    document.getElementById("saveScoreButton").onclick = function() {

        if (document.getElementById("name").value == "") {
            alert("You have to fill the name");
        } else {
            
            // Push new data 
            data.push({name: document.getElementById("name").value, score: +localStorage.getItem("currentScore")});
            data = data.sort((a,b) => a.score > b.score ? -1 : 1);
            console.log(data);

            // Persist data
            fs.writeContent("data.js", JSON.stringify(data),() => {
                console.log('hey');
            });
            
            // Restart game
            document.getElementById("name").style.value = ""; 
            document.getElementById("saveScore").style.display = "none"; 
            document.getElementById("gameBox").style.display = "unset";
            document.getElementById("gameHeader").style.display = "flex";
            init = 0;
            game.reset();    
        }
    };

    init = 0;
    game.start();
}

function setup() {
    game.gameWindow();
}

function draw() {
    game.update();
}