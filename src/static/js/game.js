var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = /** @class */ (function () {
    function Game() {
        this.gameCanvas = document.getElementById("pongCanvas");
        this.gameCanvas.width = this.gameCanvas.parentElement.clientWidth;
        this.gameCanvas.height = this.gameCanvas.parentElement.clientHeight;
        this.gameContext = this.gameCanvas.getContext("2d");
        //this.gameContext.font = "30px Orbitron";
        window.addEventListener("keydown", function (e) {
            Game.keysPressed[e.key] = true;
        });
        window.addEventListener("keyup", function (e) {
            Game.keysPressed[e.key] = false;
        });
        var paddleWidth = 8;
        var paddleHeight = 64;
        var ballSize = 8;
        var wallOffset = 20;
        this.player1 = new Paddle(wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "w", "s", "#f00");
        this.player2 = new Paddle(this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "ArrowUp", "ArrowDown", "#0f0");
        this.ball = new Ball(this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2, ballSize, ballSize);
        this.draw();
    }
    Game.prototype.drawCourt = function () {
        // Draws the court floor
        this.gameContext.fillStyle = "#008566";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        // Draws outline
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 4;
        this.gameContext.strokeRect(8, 8, this.gameCanvas.width - 16, this.gameCanvas.height - 16);
        // Draws half-way line
        this.gameContext.fillStyle = "#fff";
        this.gameContext.fillRect(this.gameCanvas.width / 2 - 2, 8, 4, this.gameCanvas.height - 16);
        // Draws score numbers
        this.gameContext.fillText(Game.player1Score.toString(), this.gameCanvas.width / 3, 100);
        this.gameContext.fillText(Game.player2Score.toString(), this.gameCanvas.width / 3 * 2, 100);
    };
    Game.prototype.update = function () {
        this.player1.update(this.gameCanvas);
        this.player2.update(this.gameCanvas);
        this.ball.update(this.player1, this.player2, this.gameCanvas);
    };
    Game.prototype.draw = function () {
        this.drawCourt();
        this.player1.draw(this.gameContext);
        this.player2.draw(this.gameContext);
        this.ball.draw(this.gameContext);
    };
    Game.prototype.gameLoop = function () {
        game.update();
        game.draw();
        requestAnimationFrame(game.gameLoop);
    };
    Game.keysPressed = [];
    Game.player1Score = 0;
    Game.player2Score = 0;
    return Game;
}());
// The parent class for paddles (players) and the ball
var Shape = /** @class */ (function () {
    function Shape(x, y, w, h) {
        this.xVel = 0;
        this.yVel = 0;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }
    return Shape;
}());
var Paddle = /** @class */ (function (_super) {
    __extends(Paddle, _super);
    function Paddle(x, y, w, h, upKey, downKey, colour) {
        var _this = _super.call(this, x, y, w, h) || this;
        _this.speed = 10;
        _this.upKey = upKey;
        _this.downKey = downKey;
        _this.colour = colour;
        return _this;
    }
    Paddle.prototype.draw = function (context) {
        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    Paddle.prototype.update = function (canvas) {
        if (Game.keysPressed[this.upKey]) {
            this.yVel = -1;
            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (Game.keysPressed[this.downKey]) {
            this.yVel = 1;
            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
    };
    return Paddle;
}(Shape));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        _this.speed = 0.5;
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2) {
            _this.xVel = 1;
        }
        else {
            _this.xVel = -1;
        }
        _this.yVel = 1;
        return _this;
    }
    Ball.prototype.draw = function (context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    Ball.prototype.update = function (player1, player2, canvas) {
        // If the ball hits the top wall, bounce it off
        if (this.y <= 10) {
            this.yVel = 1;
        }
        // If the ball hits the bottom wall, bounce it off
        if (this.y + this.height >= canvas.height - 10) {
            this.yVel = -1;
        }
        //check left canvas bounds
        if (this.x <= 0) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.player2Score += 1;
        }
        //check right canvas bounds
        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.player1Score += 1;
        }
        //check player collision
        if (this.x <= player1.x + player1.width) {
            if (this.y >= player1.y && this.y + this.height <= player1.y + player1.height) {
                this.xVel = 1;
            }
        }
        //check computer collision
        if (this.x + this.width >= player2.x) {
            if (this.y >= player2.y && this.y + this.height <= player2.y + player2.height) {
                this.xVel = -1;
            }
        }
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    };
    return Ball;
}(Shape));
var game;
function setupGame() {
    game = new Game();
}
function startGame() {
    requestAnimationFrame(game.gameLoop);
}
window.setupGame = setupGame;
window.startGame = startGame;
