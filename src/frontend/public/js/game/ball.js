import { Game } from "./../game.js";
import { Shape } from "./shape.js";
export class Ball extends Shape {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.speed = 2.0;
        this.randomDirection();
    }
    restart(canvas) {
        this.speed = 2.0;
        this.x = canvas.width / 2.0 - this.width / 2.0;
        this.y = canvas.height / 2.0 - this.height / 2.0;
        this.randomDirection();
    }
    draw(context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(player1, player2, canvas) {
        this.collisionDetection(player1, player2, canvas);
        if (this.x <= 0.0) {
            Game.player2Score += 1.0;
            this.restart(canvas);
        }
        if (this.x + this.width >= canvas.width) {
            Game.player1Score += 1.0;
            this.restart(canvas);
        }
        this.speed = this.speed > 16.0 ? 16.0 : this.speed;
        this.xprev = this.x;
        this.yprev = this.y;
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    }
    randomDirection() {
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
    }
    collisionDetection(player1, player2, canvas) {
        if ((this.y <= 10.0) ||
            (this.y + this.height >= canvas.height - 10.0)) {
            this.yVel *= -1.0;
            this.speed += 0.2;
        }
        if (this.aabb(player1) || this.aabb(player2)) {
            if ((this.y >= player1.y && this.y + this.height <= player1.y + player1.height) ||
                (this.y >= player2.y && this.y + this.height <= player2.y + player2.height)) {
                this.xVel *= -1.0;
            }
            else if ((this.x >= player1.x && this.x + this.width <= player1.x + player1.width) ||
                (this.x >= player2.x && this.x + this.width <= player2.x + player2.width)) {
                this.yVel *= -1.0;
            }
            this.speed += 0.4;
        }
    }
}
