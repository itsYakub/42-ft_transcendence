import { Game } from "./../game.js";
import { GameStateMachine } from "./../game.js";
import { stateMachine } from "./../game.js";
import { Shape } from "./shape.js";
export var PaddleType;
(function (PaddleType) {
    PaddleType[PaddleType["PADDLE_PLAYER"] = 0] = "PADDLE_PLAYER";
    PaddleType[PaddleType["PADDLE_AI"] = 1] = "PADDLE_AI";
})(PaddleType || (PaddleType = {}));
export class Paddle extends Shape {
    constructor(x, y, w, h, upKey, downKey, colour, type) {
        super(x, y, w, h);
        this.m_upKey = upKey;
        this.m_downKey = downKey;
        this.m_colour = colour;
        this.m_speed = 8.0;
        this.m_type = type;
    }
    draw(context) {
        context.fillStyle = this.m_colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(canvas, ball) {
        if (stateMachine == GameStateMachine.STATE_GAME_START) {
            if (this.m_type == PaddleType.PADDLE_PLAYER) {
                this.updatePlayer(canvas);
            }
            else {
                this.updateAI(canvas, ball);
            }
            if (this.y < 20.0) {
                this.yVel = 0.0;
                this.y = 20.0;
            }
            if (this.y + this.height > canvas.height - 20.0) {
                this.yVel = 0.0;
                this.y = canvas.height - 20.0 - this.height;
            }
            this.y += this.yVel * this.m_speed;
        }
    }
    updatePlayer(canvas) {
        if (Game.keysPressed[this.m_upKey]) {
            this.yVel = -1.0;
            if (this.y <= 20.0) {
                this.yVel = 0.0;
            }
        }
        else if (Game.keysPressed[this.m_downKey]) {
            this.yVel = 1.0;
            if (this.y + this.height >= canvas.height - 20.0) {
                this.yVel = 0.0;
            }
        }
        else {
            this.yVel = 0.0;
        }
    }
    updateAI(canvas, ball) {
        if (!this.m_aiUpdateCalled) {
            this.m_aiUpdateCalled = true;
            setInterval(() => {
                console.log("[ AI ] Ball at position: x." + ball.x + ", y." + ball.y);
                if (this.isApproaching(canvas, ball)) {
                    if (ball.y < this.y) {
                        this.yVel = -1.0;
                    }
                    else if (ball.y > this.y + this.height) {
                        this.yVel = 1.0;
                    }
                    else if (ball.y > this.y && ball.y < this.y + this.height) {
                        this.yVel = 0.0;
                    }
                }
            }, 1000);
        }
    }
    isApproaching(canvas, ball) {
        let _dist0 = Math.sqrt((ball.x - this.x) * (ball.x - this.x) + (ball.y - this.y) * (ball.y - this.y));
        let _dist1 = Math.sqrt((ball.xPrev - this.x) * (ball.xPrev - this.x) + (ball.yPrev - this.y) * (ball.yPrev - this.y));
        if (_dist0 < _dist1) {
            return (true);
        }
        return (false);
    }
}
