/*

import {
	Game,
	randomNumber,
} from "./../game.js";

import { Shape } from "./shape.js";
import { Paddle } from "./paddle.js";

export class Ball extends Shape {

	private m_speed : number = 4.0;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		this.randomDirection();
	}

	update(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
		this.collisionDetection(player1, player2, canvas);

		/* clamping the ball's m_speed to the maximum value (in this case: 12.0) (let the hell go loose)
		* * /
		this.m_speed = this.m_speed > 12.0 ? 12.0 : this.m_speed;
		this.x += this.xVel * this.m_speed;
		this.y += this.yVel * this.m_speed;
	}
	
	render(context: CanvasRenderingContext2D) {
		context.fillStyle = "#fff";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	restart(canvas : HTMLCanvasElement) {
		this.m_speed = 4.0;
		this.x = canvas.width / 2.0 - this.width / 2.0;
		this.y = canvas.height / 2.0 - this.height / 2.0 + randomNumber(-250.0, 250.0);
		this.randomDirection();
	}

	outOfBound(canvas : HTMLCanvasElement) : boolean {
		return (this.x <= 0.0 || this.x + this.width >= canvas.width);
	}

	private	randomDirection() {
		let	randomDirection : number;

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

	private	collisionDetection(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
		let	_tolerance_point : number;

		/* Ball - to - top/bottom collistion detection
		 * * /
		if (
			(this.y <= 0.0) ||
			(this.y + this.height >= canvas.height)
		) {
			this.yVel *= -1.0;
			this.m_speed += 0.25;
		}

		/* Ball - to - player collision detection
		 * SOURCE:
		 *  - https://github.com/clear-code-projects/Pong_in_Pygame/blob/master/Pong9_collision.py
		 * * /
		_tolerance_point = player1.width;
		if (
			this.aabb(player1) && this.xVel < 0.0
		) {
			
			if (Math.abs((this.x) - (player1.x + player1.width)) < _tolerance_point) {
				this.xVel *= -1.0;
				this.m_speed += 0.5;
			}
			
			else if (
				Math.abs((this.y + this.height) - (player1.y)) < _tolerance_point && this.yVel > 0 ||
				Math.abs((this.y) - (player1.y + player1.height)) < _tolerance_point && this.yVel < 0
			) {
				this.yVel *= -1.0;
			}
		}
		if (
			this.aabb(player2) && this.xVel > 0.0
		) {
			
			if (Math.abs((this.x + this.width) - (player2.x)) < _tolerance_point) {
				this.xVel *= -1.0;
				this.m_speed += 0.5;
			}

			else if (
				Math.abs((this.y + this.height) - (player2.y)) < _tolerance_point && this.yVel > 0 ||
				Math.abs((this.y) - (player2.y + player2.height)) < _tolerance_point && this.yVel < 0
			) {
				this.yVel *= -1.0;
			}
		}
	}
}

*/
