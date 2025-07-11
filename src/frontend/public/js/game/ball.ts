import { Game } from "./../game.js";
import { Shape } from "./shape.js";
import { Paddle } from "./paddle.js";

export class Ball extends Shape {

	private speed : number = 2.0;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		this.randomDirection();
	}

	restart(canvas : HTMLCanvasElement) {
		this.speed = 2.0;
		this.x = canvas.width / 2.0 - this.width / 2.0;
		this.y = canvas.height / 2.0 - this.height / 2.0;
		this.randomDirection();
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = "#fff";
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
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

		/* clamping the ball's speed to the maximum value (in this case: 16.0) (let the hell go loose)
		* */
		this.speed = this.speed > 16.0 ? 16.0 : this.speed;
		this.xprev = this.x;
		this.yprev = this.y;
		this.x += this.xVel * this.speed;
		this.y += this.yVel * this.speed;
	}

	private	randomDirection() {
		var randomDirection : number;

		randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			this.xVel = 1.0;
		} else {
			this.xVel = -1.0;
		}
		randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			this.yVel = 1.0;
		} else {
			this.yVel = -1.0;
		}
	}

	private	collisionDetection(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
		let	_tolerance_point : number;

		/* Ball - to - top/bottom collistion detection
		 * */
		if (
			(this.y <= 10.0) ||
			(this.y + this.height >= canvas.height - 10.0)
		) {
			this.yVel *= -1.0;
			this.speed += 0.25;
		}

		/* Ball - to - player collision detection
		 * SOURCE:
		 *  - https://github.com/clear-code-projects/Pong_in_Pygame/blob/master/Pong9_collision.py
		 * */
		_tolerance_point = 10.0;
		if (
			this.aabb(player1) && this.xVel < 0.0
		) {
			if (Math.abs((this.x) - (player1.x + player1.width)) < _tolerance_point) {
				this.xVel *= -1.0;
			}
			else if (
				Math.abs((this.y + this.height) - (player1.y)) < _tolerance_point && this.yVel > 0 ||
				Math.abs((this.y) - (player1.y + player1.height)) < _tolerance_point && this.yVel < 0
			) {
				this.yVel *= -1.0;
			}
			this.speed += 0.5;
		}
		if (
			this.aabb(player2) && this.xVel > 0.0
		) {
			if (Math.abs((this.x + this.width) - (player2.x)) < _tolerance_point) {
				this.xVel *= -1.0;
			}
			else if (
				Math.abs((this.y + this.height) - (player2.y)) < _tolerance_point && this.yVel > 0 ||
				Math.abs((this.y) - (player2.y + player2.height)) < _tolerance_point && this.yVel < 0
			) {
				this.yVel *= -1.0;
			}
			this.speed += 0.5;
		}
	}
}

