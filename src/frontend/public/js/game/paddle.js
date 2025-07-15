import { Game } from "./../game.js";
import { GameStateMachine } from "./../game.js";
import { randomNumber } from "./../game.js";
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
            this.updatePosition(canvas);
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
                if (stateMachine == GameStateMachine.STATE_GAME_START) {
                    if (this.isApproaching(canvas, ball)) {
                        let _pos_to_ball;
                        let _vel_x;
                        let _vel_y;
                        _pos_to_ball = Math.sqrt((ball.x - this.x) * (ball.x - this.x));
                        _vel_x = ball.xVel;
                        _vel_y = ball.yVel;
                        this.m_aiDestX = ball.x * randomNumber(0.9, 1.0);
                        this.m_aiDestY = ball.y * randomNumber(0.9, 1.0);
                        for (let i = 0.0; i < _pos_to_ball / _vel_x; i++) {
                            if (this.m_aiDestY + _vel_y <= 10.0 ||
                                this.m_aiDestY + ball.height + _vel_y >= canvas.height - 10.0) {
                                _vel_y *= -1.0;
                            }
                            this.m_aiDestX += _vel_x;
                            this.m_aiDestY += _vel_y;
                        }
                        console.log("[ AI ] Ball destination: " + this.m_aiDestX + ", " + this.m_aiDestY);
                    }
                }
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
    isApproaching(canvas, ball) {
        let _dist0 = Math.sqrt((ball.x - this.x) * (ball.x - this.x) + (ball.y - this.y) * (ball.y - this.y));
        let _dist1 = Math.sqrt((ball.xPrev - this.x) * (ball.xPrev - this.x) + (ball.yPrev - this.y) * (ball.yPrev - this.y));
        if (_dist0 < _dist1) {
            return (true);
        }
        return (false);
    }
}
