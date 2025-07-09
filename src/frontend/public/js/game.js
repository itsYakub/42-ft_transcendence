import { Paddle } from "./game/paddle.js";
import { Ball } from "./game/ball.js";
var GameStateMachine;
(function (GameStateMachine) {
    GameStateMachine[GameStateMachine["STATE_GAME_SETUP"] = 0] = "STATE_GAME_SETUP";
    GameStateMachine[GameStateMachine["STATE_GAME_START"] = 1] = "STATE_GAME_START";
    GameStateMachine[GameStateMachine["STATE_GAME_PAUSE"] = 2] = "STATE_GAME_PAUSE";
})(GameStateMachine || (GameStateMachine = {}));
export class Game {
    constructor() {
        this.m_gameCanvas = document.getElementById("pongCanvas");
        this.m_gameCanvas.width = this.m_gameCanvas.parentElement.clientWidth;
        this.m_gameCanvas.height = this.m_gameCanvas.parentElement.clientHeight;
        this.m_gameContext = this.m_gameCanvas.getContext("2d");
        window.addEventListener("keydown", function (e) {
            Game.keysPressed[e.key] = true;
        });
        window.addEventListener("keyup", function (e) {
            Game.keysPressed[e.key] = false;
        });
        var paddleWidth = 16;
        var paddleHeight = 80;
        var ballSize = 16;
        var wallOffset = 24;
        this.m_player1 = new Paddle(wallOffset, this.m_gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "w", "s", "#fa2222");
        this.m_player2 = new Paddle(this.m_gameCanvas.width - (wallOffset + paddleWidth), this.m_gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "ArrowUp", "ArrowDown", "#22fa22");
        this.m_ball = new Ball(this.m_gameCanvas.width / 2 - ballSize / 2, this.m_gameCanvas.height / 2 - ballSize / 2, ballSize, ballSize);
        this.draw();
    }
    drawCourt() {
        this.m_gameContext.fillStyle = "#008566";
        this.m_gameContext.fillRect(0, 0, this.m_gameCanvas.width, this.m_gameCanvas.height);
        this.m_gameContext.strokeStyle = "#fff";
        this.m_gameContext.lineWidth = 4;
        this.m_gameContext.strokeRect(8, 8, this.m_gameCanvas.width - 16, this.m_gameCanvas.height - 16);
        this.m_gameContext.fillStyle = "#fff";
        this.m_gameContext.fillRect(this.m_gameCanvas.width / 2 - 2, 8, 4, this.m_gameCanvas.height - 16);
        this.m_gameContext.fillText(Game.player1Score.toString(), this.m_gameCanvas.width / 3, 100);
        this.m_gameContext.fillText(Game.player2Score.toString(), this.m_gameCanvas.width / 3 * 2, 100);
    }
    update() {
        this.m_player1.update(this.m_gameCanvas);
        this.m_player2.update(this.m_gameCanvas);
        if (stateMachine == GameStateMachine.STATE_GAME_START) {
            this.m_ball.update(this.m_player1, this.m_player2, this.m_gameCanvas);
        }
    }
    draw() {
        this.drawCourt();
        this.m_player1.draw(this.m_gameContext);
        this.m_player2.draw(this.m_gameContext);
        this.m_ball.draw(this.m_gameContext);
    }
    gameLoop() {
        game.update();
        game.draw();
        requestAnimationFrame(game.gameLoop);
    }
}
Game.keysPressed = [];
Game.player1Score = 0;
Game.player2Score = 0;
var game;
var stateMachine;
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
export function setupGameFrame() {
    document.getElementById("gameSetup").addEventListener("click", async () => { setupGame(); });
    document.getElementById("gamePlay").addEventListener("click", async () => { playGame(); });
    document.getElementById("gamePause").addEventListener("click", async () => { pauseGame(); });
}
