import { Game } from "./../game.js";
import { GameStateMachine } from "./../game.js";
import { randomNumber } from "./../game.js";
import { stateMachine } from "./../game.js";
import { Shape } from "./shape.js";
export class Ball extends Shape {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.speed = 8.0;
        this.randomDirection();
    }
    restart(canvas) {
        this.speed = 8.0;
        this.x = canvas.width / 2.0 - this.width / 2.0;
        this.y = canvas.height / 2.0 - this.height / 2.0 + randomNumber(-250.0, 250.0);
        this.randomDirection();
    }
    draw(context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(player1, player2, canvas) {
        if (stateMachine == GameStateMachine.STATE_GAME_START) {
            this.collisionDetection(player1, player2, canvas);
            if (this.x <= 0.0) {
                Game.player2Score += 1.0;
                this.restart(canvas);
            }
            if (this.x + this.width >= canvas.width) {
                Game.player1Score += 1.0;
                this.restart(canvas);
            }
            this.speed = this.speed > 12.0 ? 12.0 : this.speed;
            this.xPrev = this.x;
            this.yPrev = this.y;
            this.x += this.xVel * this.speed;
            this.y += this.yVel * this.speed;
        }
    }
    randomDirection() {
        var randomDirection;
        this.xVel = 1.0;
        if (Math.floor(Math.random() * 2) + 1 % 2) {
            this.xVel *= -1.0;
        }
        this.yVel = 1.0;
        if (Math.floor(Math.random() * 2) + 1 % 2) {
            this.yVel *= -1.0;
        }
    }
    collisionDetection(player1, player2, canvas) {
        let _tolerance_point;
        if ((this.y <= 10.0) ||
            (this.y + this.height >= canvas.height - 10.0)) {
            this.yVel *= -1.0;
            this.speed += 0.25;
        }
        _tolerance_point = player1.width;
        if (this.aabb(player1) && this.xVel < 0.0) {
            if (Math.abs((this.x) - (player1.x + player1.width)) < _tolerance_point) {
                this.xVel *= -1.0;
                this.speed += 0.5;
            }
            else if (Math.abs((this.y + this.height) - (player1.y)) < _tolerance_point && this.yVel > 0 ||
                Math.abs((this.y) - (player1.y + player1.height)) < _tolerance_point && this.yVel < 0) {
                this.yVel *= -1.0;
            }
        }
        if (this.aabb(player2) && this.xVel > 0.0) {
            if (Math.abs((this.x + this.width) - (player2.x)) < _tolerance_point) {
                this.xVel *= -1.0;
                this.speed += 0.5;
            }
            else if (Math.abs((this.y + this.height) - (player2.y)) < _tolerance_point && this.yVel > 0 ||
                Math.abs((this.y) - (player2.y + player2.height)) < _tolerance_point && this.yVel < 0) {
                this.yVel *= -1.0;
            }
        }
    }
}
