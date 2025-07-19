import { Game, } from "./../game.js";
import { Shape } from "./shape.js";
export var PaddleType;
(function (PaddleType) {
    PaddleType[PaddleType["PADDLE_PLAYER"] = 0] = "PADDLE_PLAYER";
    PaddleType[PaddleType["PADDLE_AI"] = 1] = "PADDLE_AI";
})(PaddleType || (PaddleType = {}));
export class Paddle extends Shape {
    constructor(x, y, w, h, upKey, downKey, colour, type) {
        super(x, y, w, h);
        this.m_initialX = x;
        this.m_initialY = y;
        this.m_speed = 8.0;
        this.m_upKey = upKey;
        this.m_downKey = downKey;
        this.m_colour = colour;
        this.m_type = type;
    }
    update(canvas, ball) {
        if (this.m_type == PaddleType.PADDLE_PLAYER) {
            this.updatePlayer(canvas);
        }
        else {
            this.updateAI(canvas, ball);
        }
        this.updatePosition(canvas);
    }
    render(context) {
        context.fillStyle = this.m_colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    restart() {
        this.x = this.m_initialX;
        this.y = this.m_initialY;
        this.xVel = this.yVel = 0.0;
    }
    updatePlayer(canvas) {
        if (Game.keysPressed[this.m_upKey]) {
            this.yVel = -1.0;
            if (this.y <= 0.0) {
                this.yVel = 0.0;
            }
        }
        else if (Game.keysPressed[this.m_downKey]) {
            this.yVel = 1.0;
            if (this.y + this.height >= canvas.height) {
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
                this.aiLogic(canvas, ball);
            }, 1000);
        }
        if (this.y + this.height < this.m_aiDestY) {
            this.yVel = 1.0;
        }
        else if (this.y > this.m_aiDestY) {
            this.yVel = -1.0;
        }
        else {
            this.yVel = 0.0;
        }
    }
    updatePosition(canvas) {
        if (this.y < 0.0) {
            this.yVel = 0.0;
            this.y = 0.0;
        }
        if (this.y + this.height > canvas.height) {
            this.yVel = 0.0;
            this.y = canvas.height - this.height;
        }
        this.y += this.yVel * this.m_speed;
    }
    aiLogic(canvas, ball) {
        let _dis_to_ball;
        let _vel_x;
        let _vel_y;
        _dis_to_ball = Math.sqrt((ball.x - this.x) * (ball.x - this.x));
        _vel_x = ball.xVel;
        _vel_y = ball.yVel;
        this.m_aiDestX = ball.x;
        this.m_aiDestY = ball.y;
        for (;;) {
            if (this.m_aiDestY + _vel_y <= 0.0 ||
                this.m_aiDestY + ball.height + _vel_y >= canvas.height) {
                _vel_y *= -1.0;
            }
            if (this.m_aiDestX + _vel_x <= 0.0 ||
                this.m_aiDestX + ball.width + _vel_x >= canvas.width) {
                _vel_x *= -1.0;
            }
            this.m_aiDestX += _vel_x;
            this.m_aiDestY += _vel_y;
            if (Math.sqrt((this.m_aiDestX - this.x) * (this.m_aiDestX - this.x)) < 64.0) {
                break;
            }
        }
        console.log("[ AI ] Ball destination: " + this.m_aiDestX + ", " + this.m_aiDestY);
    }
}
