import { Game } from "./../game.js";
import { Shape } from "./shape.js";
export class Paddle extends Shape {
    constructor(x, y, w, h, upKey, downKey, colour) {
        super(x, y, w, h);
        this.speed = 10.0;
        this.upKey = upKey;
        this.downKey = downKey;
        this.colour = colour;
    }
    draw(context) {
        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(canvas) {
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
    }
}
