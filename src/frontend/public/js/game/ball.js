import { randomNumber, } from "./../game.js";
import { Shape } from "./shape.js";
export class Ball extends Shape {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.m_speed = 4.0;
        this.randomDirection();
    }
    update(player1, player2, canvas) {
        this.collisionDetection(player1, player2, canvas);
        this.m_speed = this.m_speed > 12.0 ? 12.0 : this.m_speed;
        this.x += this.xVel * this.m_speed;
        this.y += this.yVel * this.m_speed;
    }
    render(context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    restart(canvas) {
        this.m_speed = 4.0;
        this.x = canvas.width / 2.0 - this.width / 2.0;
        this.y = canvas.height / 2.0 - this.height / 2.0 + randomNumber(-250.0, 250.0);
        this.randomDirection();
    }
    outOfBound(canvas) {
        return (this.x <= 0.0 || this.x + this.width >= canvas.width);
    }
    randomDirection() {
        let randomDirection;
        randomDirection = Math.random();
        console.log("[ BALL ] Random direction: " + randomDirection);
        if (randomDirection > 0.5) {
            this.xVel = -1.0;
        }
        else {
            this.xVel = 1.0;
        }
        randomDirection = Math.random();
        console.log("[ BALL ] Random direction: " + randomDirection);
        if (randomDirection > 0.5) {
            this.yVel = -1.0;
        }
        else {
            this.yVel = 1.0;
        }
    }
    collisionDetection(player1, player2, canvas) {
        let _tolerance_point;
        if ((this.y <= 0.0) ||
            (this.y + this.height >= canvas.height)) {
            this.yVel *= -1.0;
            this.m_speed += 0.25;
        }
        _tolerance_point = player1.width;
        if (this.aabb(player1) && this.xVel < 0.0) {
            if (Math.abs((this.x) - (player1.x + player1.width)) < _tolerance_point) {
                this.xVel *= -1.0;
                this.m_speed += 0.5;
            }
            else if (Math.abs((this.y + this.height) - (player1.y)) < _tolerance_point && this.yVel > 0 ||
                Math.abs((this.y) - (player1.y + player1.height)) < _tolerance_point && this.yVel < 0) {
                this.yVel *= -1.0;
            }
        }
        if (this.aabb(player2) && this.xVel > 0.0) {
            if (Math.abs((this.x + this.width) - (player2.x)) < _tolerance_point) {
                this.xVel *= -1.0;
                this.m_speed += 0.5;
            }
            else if (Math.abs((this.y + this.height) - (player2.y)) < _tolerance_point && this.yVel > 0 ||
                Math.abs((this.y) - (player2.y + player2.height)) < _tolerance_point && this.yVel < 0) {
                this.yVel *= -1.0;
            }
        }
    }
}
