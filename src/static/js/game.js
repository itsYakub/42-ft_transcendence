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
var GameStateMachine;
(function (GameStateMachine) {
    GameStateMachine[GameStateMachine["STATE_GAME_SETUP"] = 0] = "STATE_GAME_SETUP";
    GameStateMachine[GameStateMachine["STATE_GAME_START"] = 1] = "STATE_GAME_START";
    GameStateMachine[GameStateMachine["STATE_GAME_PAUSE"] = 2] = "STATE_GAME_PAUSE";
})(GameStateMachine || (GameStateMachine = {}));
var Game = /** @class */ (function () {
    function Game() {
        this.m_gameCanvas = document.getElementById("pongCanvas");
        this.m_gameCanvas.width = this.m_gameCanvas.parentElement.clientWidth;
        this.m_gameCanvas.height = this.m_gameCanvas.parentElement.clientHeight;
        this.m_gameContext = this.m_gameCanvas.getContext("2d");
        //this.gameContext.font = "30px Orbitron";
        window.addEventListener("keydown", function (e) {
            Game.keysPressed[e.key] = true;
        });
        window.addEventListener("keyup", function (e) {
            Game.keysPressed[e.key] = false;
        });
        // Adjust these dependent on available space
        var paddleWidth = 16;
        var paddleHeight = 80;
        var ballSize = 16;
        var wallOffset = 24;
        this.m_player1 = new Paddle(wallOffset, this.m_gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "w", "s", "#fa2222");
        this.m_player2 = new Paddle(this.m_gameCanvas.width - (wallOffset + paddleWidth), this.m_gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "ArrowUp", "ArrowDown", "#22fa22");
        this.m_ball = new Ball(this.m_gameCanvas.width / 2 - ballSize / 2, this.m_gameCanvas.height / 2 - ballSize / 2, ballSize, ballSize);
        this.draw();
    }
    Game.prototype.drawCourt = function () {
        // Draws the court floor
        this.m_gameContext.fillStyle = "#008566";
        this.m_gameContext.fillRect(0, 0, this.m_gameCanvas.width, this.m_gameCanvas.height);
        // Draws outline
        this.m_gameContext.strokeStyle = "#fff";
        this.m_gameContext.lineWidth = 4;
        this.m_gameContext.strokeRect(8, 8, this.m_gameCanvas.width - 16, this.m_gameCanvas.height - 16);
        // Draws half-way line
        this.m_gameContext.fillStyle = "#fff";
        this.m_gameContext.fillRect(this.m_gameCanvas.width / 2 - 2, 8, 4, this.m_gameCanvas.height - 16);
        // Draws score numbers
        this.m_gameContext.fillText(Game.player1Score.toString(), this.m_gameCanvas.width / 3, 100);
        this.m_gameContext.fillText(Game.player2Score.toString(), this.m_gameCanvas.width / 3 * 2, 100);
    };
    Game.prototype.update = function () {
        this.m_player1.update(this.m_gameCanvas);
        this.m_player2.update(this.m_gameCanvas);
        if (stateMachine == GameStateMachine.STATE_GAME_START) {
            this.m_ball.update(this.m_player1, this.m_player2, this.m_gameCanvas);
        }
    };
    Game.prototype.draw = function () {
        this.drawCourt();
        this.m_player1.draw(this.m_gameContext);
        this.m_player2.draw(this.m_gameContext);
        this.m_ball.draw(this.m_gameContext);
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
        _this.speed = 10.0;
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
            this.yVel = -1.0;
            if (this.y <= 20.0) {
                this.yVel = 0.0;
            }
        }
        else if (Game.keysPressed[this.downKey]) {
            this.yVel = 1.0;
            if (this.y + this.height >= canvas.height - 20.0) {
                this.yVel = 0.0;
            }
        }
        else {
            this.yVel = 0.0;
        }
        this.y += this.yVel * this.speed;
    };
    return Paddle;
}(Shape));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        _this.speed = 2.0;
        _this.randomDirection();
        return _this;
    }
    Ball.prototype.restart = function (canvas) {
        this.speed = 2.0;
        this.x = canvas.width / 2.0 - this.width / 2.0;
        this.y = canvas.height / 2.0 - this.height / 2.0;
        this.randomDirection();
    };
    Ball.prototype.draw = function (context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    Ball.prototype.update = function (player1, player2, canvas) {
        this.collisionDetection(player1, player2, canvas);
        // If the ball goes past the left player
        if (this.x <= 0.0) {
            Game.player2Score += 1.0;
            this.restart(canvas);
        }
        // If the ball goes past the right player
        if (this.x + this.width >= canvas.width) {
            Game.player1Score += 1.0;
            this.restart(canvas);
        }
        /* clamping the ball's speed to the maximum value (in this case: 16.0) (let the hell go loose) */
        this.speed = this.speed > 16.0 ? 16.0 : this.speed;
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    };
    Ball.prototype.randomDirection = function () {
        var randomDirection;
        randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2) {
            this.xVel = 1.0;
        }
        else {
            this.xVel = -1.0;
        }
        randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2) {
            this.yVel = 1.0;
        }
        else {
            this.yVel = -1.0;
        }
    };
    Ball.prototype.collisionDetection = function (player1, player2, canvas) {
        // Basic ball - to - top/bottom collistion detection
        if ((this.y <= 10.0) ||
            (this.y + this.height >= canvas.height - 10.0)) {
            this.yVel *= -1.0;
            this.speed += 0.2;
        }
        // Basic ball - to - player collision detection
        // Horizontal collision
        if (aabb(this, player1) || aabb(this, player2)) {
            /* NOTE(joleksia):
             *  In this if - block, I think that we should handle both horizontal and vertical bouncess of the paddle
             * */
            if ((this.y >= player1.y && this.y + this.height <= player1.y + player1.height) ||
                (this.y >= player2.y && this.y + this.height <= player2.y + player2.height)) {
                this.xVel *= -1.0;
            }
            this.speed += 0.4;
        }
    };
    return Ball;
}(Shape));
var game;
var stateMachine;
function aabb(a, b) {
    return ((a.x < (b.x + b.width) && (a.x + a.width) > b.x) &&
        (a.y < (b.y + b.height) && (a.y + a.height) > b.y));
}
// Calculates the starting conditions and draws everything
// NOTE(joleksia): If you spam this function, the velocity goes insane because now we're launching many revursive functions of update for the Game
function setupGame() {
    game = new Game();
    stateMachine = GameStateMachine.STATE_GAME_SETUP;
    requestAnimationFrame(game.gameLoop);
}
function playGame() {
    stateMachine = GameStateMachine.STATE_GAME_START;
}
function pauseGame() {
    stateMachine = GameStateMachine.STATE_GAME_PAUSE;
}
window.setupGame = setupGame;
window.playGame = playGame;
window.pauseGame = pauseGame;
//# sourceMappingURL=game.js.map